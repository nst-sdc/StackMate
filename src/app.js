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
    saveNote: "Nota guardada",
    languageLabel: "Idioma:",
  },
};

const App = () => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [warning, setWarning] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [selectedColor, setSelectedColor] = useState("#2B77BD");
  const [colorFormat, setColorFormat] = useState("hex");

  useEffect(() => {
    const saved = localStorage.getItem("my-vscode-note");
    if (saved) {
      setSavedNote(saved);
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
    alert("✅ Note Saved!");
    setNote("");
  };

  const handleClear = () => {
    localStorage.removeItem("my-vscode-note");
    setNote("");
    setSavedNote("");
    setWarning("");
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleCopyColor = () => {
    const colorValue = colorFormat === "hex" ? selectedColor : hexToRgb(selectedColor);
    navigator.clipboard.writeText(colorValue);
    alert(`${colorFormat.toUpperCase()} ${colorValue} copied to clipboard!`);
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
          <option value="spanish">Española</option>
        </select>
      </div>

      <textarea
        placeholder={translations[language].placeholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={styleTextArea}
      ></textarea>

      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 {translations[language].saveButton}
        </button>
        <button onClick={handleClear} style={styles.clearBtn}>
          🧹 {translations[language].clearButton}
        </button>
        <button onClick={() => setDarkMode(!darkMode)} style={styleToggleButton}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {warning && <div style={styles.warning}>{warning}</div>}

      {savedNote && (
        <div style={styleSavedNotes}>
          <strong>🗒️ {translations[language].saveNote}:</strong>
          <p>{savedNote}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <label htmlFor="colorPicker" style={{ marginRight: "10px", fontSize: "15px" }}>
          🎨 Pick a Color:
        </label>
        <input
          type="color"
          id="colorPicker"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />

        <select
          value={colorFormat}
          onChange={(e) => setColorFormat(e.target.value)}
          style={styles.select}
        >
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>

        <button onClick={handleCopyColor} style={styles.colorBtn}>
          📋 Copy {colorFormat.toUpperCase()}
        </button>
      </div>
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
    textAlign: "center",
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
    margin: "30px 0",
    fontWeight: "bold",
    fontSize: "18px",
  },
  colorBtn: {
    marginLeft: "10px",
    padding: "6px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#eee",
    cursor: "pointer",
  },
  select: {
    border: "2px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
  },
  languageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
};

export default App;
