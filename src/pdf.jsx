import React, { useState } from "react";
import { jsPDF } from "jspdf";

function PdfReader() {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({
    questionText: "",
    options: []
  });

  // Function to handle file upload and process text file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setFileName(file.name);
        setError("");

        // Read file as text
        const text = await file.text();
        
        // Parse MCQs from the text
        const parsedQuestions = parseMcqs(text);
        setQuestions(parsedQuestions);
        setSelectedQuestions([]);
        
      } catch (err) {
        setError("Error processing file: " + err.message);
      }
    }
  };

  // Function to parse MCQs from text
  const parseMcqs = (text) => {
    // Split text by question numbers (1., 2., etc.)
    const questionBlocks = text.split(/(?=\d+\.)/);
    
    return questionBlocks
      .filter(block => block.trim()) // Remove empty blocks
      .map(block => {
        // Separate question text from options
        const questionMatch = block.match(/^\d+\.\s*(.*?)(?=\(\d+\))/s);
        if (!questionMatch) return null;
        
        const questionText = questionMatch[1].trim();
        
        // Extract options
        const optionsText = block.substring(questionMatch[0].length).trim();
        const optionsMatch = optionsText.match(/\(\d+\)[^(]*/g);
        
        const options = optionsMatch 
          ? optionsMatch.map(option => option.trim())
          : [];
        
        return { 
          questionText, 
          options,
          fullText: block.trim()
        };
      })
      .filter(q => q !== null); // Remove failed parses
  };

  // Function to handle selecting or deselecting a question
  const handleCheckboxChange = (index) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Function to start editing a question
  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setEditedQuestion({
      questionText: questions[index].questionText,
      options: [...questions[index].options]
    });
  };

  // Function to handle question text changes during edit
  const handleQuestionTextChange = (e) => {
    setEditedQuestion({
      ...editedQuestion,
      questionText: e.target.value
    });
  };

  // Function to handle option text changes during edit
  const handleOptionChange = (optionIndex, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[optionIndex] = value;
    setEditedQuestion({
      ...editedQuestion,
      options: updatedOptions
    });
  };

  // Function to save edited question
  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      
      // Update the question
      updatedQuestions[editingIndex] = {
        ...updatedQuestions[editingIndex],
        questionText: editedQuestion.questionText,
        options: editedQuestion.options,
        // Regenerate fullText
        fullText: `${editingIndex + 1}. ${editedQuestion.questionText} ${editedQuestion.options.join(' ')}`
      };
      
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  // Function to delete a question
  const handleDeleteQuestion = (indexToDelete) => {
    // Remove the question
    const updatedQuestions = questions.filter((_, index) => index !== indexToDelete);
    
    // Update the selected questions array
    const updatedSelectedQuestions = selectedQuestions
      .filter(index => index !== indexToDelete)
      .map(index => index > indexToDelete ? index - 1 : index);
    
    setQuestions(updatedQuestions);
    setSelectedQuestions(updatedSelectedQuestions);
    
    // If currently editing this question, cancel the edit
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
    }
  };

  // Function to generate PDF from selected questions
  const generatePDF = () => {
    if (selectedQuestions.length === 0) {
      alert("No questions selected!");
      return;
    }

    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = margin;

    // Add title
    doc.setFontSize(16);
    doc.text("Selected Questions", margin, y);
    y += 15;
    
    // Add selected questions
    doc.setFontSize(12);
    
    selectedQuestions.forEach((index) => {
      const question = questions[index];
      
      // Add question with word wrapping
      const splitText = doc.splitTextToSize(question.fullText, pageWidth - 2 * margin);
      
      // Check if we need a new page
      if (y + splitText.length * 7 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      
      doc.text(splitText, margin, y);
      y += splitText.length * 7 + 10; // Add space after each question
    });

    doc.save("selected-questions.pdf");
  };

  return (
    <>
      <style>
        {`
          .app {
            background-color: white;
            max-width: 1000px;
            margin: 30px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .app h1 {
            text-align: center;
            color: #1d3557;
            font-size: 28px;
            margin-bottom: 20px;
          }
          .upload-section {
            text-align: center;
            margin-bottom: 20px;
            padding: 30px;
            border: 2px dashed #457b9d;
            border-radius: 8px;
            background-color: #f8f9fa;
          }
          .upload-button {
            background-color: #457b9d;
            color: white;
            padding: 12px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .upload-button:hover {
            background-color: #1d3557;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .error {
            color: #d32f2f;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background-color: #ffebee;
            border-radius: 4px;
          }
          .question-list {
            max-height: 600px;
            overflow-y: auto;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 10px;
            background-color: #f9f9f9;
            margin-top: 20px;
          }
          .question-item {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
            transition: all 0.3s;
            border-radius: 6px;
            margin-bottom: 10px;
          }
          .question-item:last-child {
            border-bottom: none;
          }
          .question-item:hover {
            background-color: #f5f5f5;
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          }
          .selected-question {
            background-color: #e8f4fd;
          }
          .question-checkbox {
            margin-right: 15px;
            min-width: 20px;
          }
          .question-content {
            flex-grow: 1;
          }
          .question-text {
            font-weight: 500;
            margin-bottom: 12px;
            line-height: 1.5;
          }
          .options-list {
            padding-left: 20px;
          }
          .option-item {
            margin-bottom: 8px;
            line-height: 1.4;
          }
          .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
          }
          .edit-btn, .delete-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
          }
          .edit-btn {
            background-color: #4caf50;
            color: white;
          }
          .edit-btn:hover {
            background-color: #43a047;
          }
          .delete-btn {
            background-color: #f44336;
            color: white;
          }
          .delete-btn:hover {
            background-color: #e53935;
          }
          .edit-form {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 15px;
          }
          .save-btn, .cancel-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          }
          .save-btn {
            background-color: #4caf50;
            color: white;
          }
          .save-btn:hover {
            background-color: #43a047;
          }
          .cancel-btn {
            background-color: #9e9e9e;
            color: white;
          }
          .cancel-btn:hover {
            background-color: #757575;
          }
          .pdf-button-container {
            text-align: center;
            margin-top: 30px;
          }
          .pdf-button {
            background-color: #1d3557;
            color: white;
            padding: 14px 28px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .pdf-button:hover {
            background-color: #457b9d;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .pdf-button svg {
            margin-right: 5px;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            background-color: #e8f4fd;
            color: #1d3557;
            font-size: 14px;
            font-weight: 600;
            margin-left: 10px;
          }
          #file-input {
            display: none;
          }
          .control-panel {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .control-panel h2 {
            margin: 0;
            color: #1d3557;
          }
          .stats {
            display: flex;
            gap: 15px;
          }
          .stat-item {
            background-color: #f0f8ff;
            padding: 8px 15px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
          }
        `}
      </style>

      <div className="navbar">
        <div className="logo">
          <img
            src="https://parishramaneetacademy.com/wp-content/uploads/2023/05/Parishrama-NEET-ENGLISH-copy-300x111.webp"
            alt="Parishrama NEET Academy"
            style={{ width: "100%", height: "10vh" }}
          />
        </div>
        <div className="menu-toggle">&#9776;</div>
        <ul className="menu">
          <li>Home</li>
          <li>Tutorials</li>
          <li>Question</li>
          <li>Contact</li>
        </ul>
      </div>

      <div className="app">
        <h1>Question : Biology </h1>

        <div className="upload-section">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            id="file-input"
          />
          <label htmlFor="file-input" className="upload-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Text File
          </label>
          <p style={{marginTop: "10px", color: "#666"}}>Upload a text file containing MCQs</p>
        </div>

        {error && <div className="error">{error}</div>}

        {fileName && questions.length > 0 && (
          <div>
            <div className="control-panel">
              <h2>Questions from: {fileName}</h2>
              <div className="stats">
                <div className="stat-item">Total: {questions.length}</div>
                <div className="stat-item">Selected: {selectedQuestions.length}</div>
              </div>
            </div>

            <div className="question-list">
              {questions.map((question, index) => (
                <div 
                  key={index} 
                  className={`question-item ${selectedQuestions.includes(index) ? 'selected-question' : ''}`}
                >
                  <div className="question-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                      style={{width: "18px", height: "18px"}}
                    />
                  </div>
                  <div className="question-content">
                    <div className="question-text">
                      <strong>{index + 1}.</strong> {question.questionText}
                    </div>
                    <div className="options-list">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="option-item">
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    {editingIndex !== index && (
                      <div className="action-buttons">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEditQuestion(index)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteQuestion(index)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    
                    {editingIndex === index && (
                      <div className="edit-form">
                        <div className="form-group">
                          <label htmlFor={`question-${index}`}>Question Text:</label>
                          <textarea
                            id={`question-${index}`}
                            className="form-control"
                            value={editedQuestion.questionText}
                            onChange={handleQuestionTextChange}
                            rows="3"
                          />
                        </div>
                        
                        {editedQuestion.options.map((option, optIndex) => (
                          <div className="form-group" key={optIndex}>
                            <label htmlFor={`option-${index}-${optIndex}`}>Option {optIndex + 1}:</label>
                            <input
                              type="text"
                              id={`option-${index}-${optIndex}`}
                              className="form-control"
                              value={option}
                              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                            />
                          </div>
                        ))}
                        
                        <div className="form-buttons">
                          <button className="save-btn" onClick={handleSaveEdit}>
                            Save Changes
                          </button>
                          <button className="cancel-btn" onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {questions.length > 0 && (
              <div className="pdf-button-container">
                <button 
                  onClick={generatePDF} 
                  className="pdf-button"
                  disabled={selectedQuestions.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Generate PDF
                  {selectedQuestions.length > 0 && (
                    <span className="badge">{selectedQuestions.length} selected</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PdfReader;