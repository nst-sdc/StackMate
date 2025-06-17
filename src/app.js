import React, { useState, useEffect } from "react";

const App = () => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [warning, setWarning] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-vscode-note");
    if (saved) {
      setSavedNote(saved);
      setNote("");
    }
  }, []);

  const handleSave = () => {
    if (note.trim() === "") {
      setWarning("Cannot save an empty note!");
      return;
    }
    setWarning("");
    localStorage.setItem("my-vscode-note", note);
    setSavedNote(note);
    setNote("");
  };

  const handleClear = () => {
    localStorage.removeItem("my-vscode-note");
    setNote("");
    setSavedNote("");
    setWarning("");
  };

  const styleContainer = {
    ...styles.container,
    backgroundColor: darkMode ? "#121212" : "#f5f5f5",
    color: darkMode ? "#ffffff" : "#000000",
  };

  const styleTextArea = {
    ...styles.textarea,
    backgroundColor: darkMode ? "#1e1e1e" : "#fff",
    color: darkMode ? "#fff" : "#000",
    border: darkMode ? "1px solid #555" : "1px solid #ccc",
  };

  const styleToggleButton = {
    ...styles.toggleBtn,
    backgroundColor: darkMode ? "#333" : "#eee",
    color: darkMode ? "#fff" : "#000",
  };

  const styleSavedNotes = {
    ...styles.saved,
    backgroundColor: darkMode ? "#1e1e1e" : "#fff",
    color: darkMode ? "#fff" : "#000",
    border: darkMode ? "1px solid #555" : "1px solid #ccc",
  };

  return (
    <div style={styleContainer}>
      <h2 style={styles.heading}>📝 VS Code Notes</h2>
      <textarea
        placeholder="Write your thoughts..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={styleTextArea}
      ></textarea>

      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 Save Note
        </button>
        <button onClick={handleClear} style={styles.clearBtn}>
          🧹 Clear
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={styleToggleButton}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {warning && <div style={styles.warning}>{warning}</div>}

      {savedNote && (
        <div style={styleSavedNotes}>
          <strong>🗒️ Saved Note:</strong>
          <p>{savedNote}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: "20px",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    resize: "vertical",
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  clearBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  toggleBtn: {
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saved: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "6px",
  },
  warning: {
    color: "#cc3300",
    margin: "30px 30px",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export default App;
