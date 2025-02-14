import React, { useState } from "react";

const CustomDropdown = ({ isExpanded }) => {
  const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");
  const [isOpen, setIsOpen] = useState(false);

  const dropdownContainer = {
    position: "relative",
    width: "100%",
    marginTop: "12px",
    display: isExpanded ? "block" : "none",
  };

  const selectedOption = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    outline: "none",
  };

  const dropdownList = {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    marginTop: "4px",
    backgroundColor: "#000",
    border: "1px solid #333",
    borderRadius: "8px",
    overflow: "hidden",
    zIndex: "1000",
  };

  const option = {
    padding: "12px",
    cursor: "pointer",
    color: "#fff",
    backgroundColor: "#000",
    fontSize: "16px",
    transition: "background-color 0.2s",
    border: "none",
    width: "100%",
    textAlign: "left",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#666";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#333";
  };

  return (
    <div style={dropdownContainer}>
      <div
        style={selectedOption}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
      >
        <span>{selectedModel}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-down"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div style={dropdownList}>
          <div
            style={option}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000";
            }}
            onClick={() => {
              setSelectedModel("Gemini 1.5 Pro");
              setIsOpen(false);
            }}
          >
            Gemini 1.5 Pro
          </div>
          <div
            style={option}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000";
            }}
            onClick={() => {
              setSelectedModel("GPT 4.0");
              setIsOpen(false);
            }}
          >
            GPT 4.0
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
