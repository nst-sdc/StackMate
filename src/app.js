import React, { useState, useEffect } from "react";

const translations = {
  english: {
    title: "VS Code Notes",
    placeholder: "Write your thoughts...",
    saveButton: "Save Note",
    clearButton: "Clear",
    saveNote: "Saved Note",
    languageLabel: "Language:",
  },
  hindi: {
    title: "VS कोड नोट्स",
    placeholder: "अपने विचार लिखें...",
    saveButton: "नोट सहेजें",
    clearButton: "साफ करें",
    saveNote: "सहेजा गया नोट",
    languageLabel: "भाषा:",
  },
  spanish: {
    title: "Notas de VS Code",
    placeholder: "Escribe tus pensamientos...",
    saveButton: "Guardar Nota",
    clearButton: "Borrar",
    languageLabel: "Idioma:",
  },
};

const App = () => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [warning, setWarning] = useState("");
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    const saved = localStorage.getItem("my-vscode-note");
    if (saved) {
      setSavedNote(saved);
      setNote("");
    }
  }, []);

  const handleSave = () => {
    if (note.trim() === "") {
      setWarning("Cannot Save empty note!");
      return;
    }

    setWarning("");
    localStorage.setItem("my-vscode-note", note);
    setSavedNote(note);
    alert("✅ Note Saved!");
    setNote("");
  };

  const handleClear = () => {
    localStorage.removeItem("my-vscode-note");
    setNote("");
    setSavedNote("");
    setWarning("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 {translations[language].title}</h2>
      <div style={styles.languageContainer}>
        <h3>{translations[language].languageLabel}:</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
        >
          <option value="english">English</option>
          <option value="hindi">हिन्दी</option>
          <option value="spanish">española</option>
        </select>
      </div>

      <textarea
        placeholder={translations[language].placeholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={styles.textarea}
      ></textarea>
      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 {translations[language].saveButton}
        </button>
        <button onClick={handleClear} style={styles.clearBtn}>
          🧹 {translations[language].clearButton}
        </button>
      </div>

      {warning && <div style={styles.warning}>{warning}</div>}

      {savedNote && (
        <div style={styles.saved}>
          <strong>🗒️ {translations[language].saveNote}:</strong>
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
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
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
  saved: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  warning: {
    color: "#cc3300",
    margin: "30px 30px",
    fontWeight: "bold",
    fontSize: "20px",
  },
  languageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  select: {
    border: "2px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
  },
};

export default App;
