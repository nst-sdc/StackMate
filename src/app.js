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
const devTips = [
  "Use meaningful variable names to improve code readability, e.g., `userCount` instead of `x`.",
  "Break down complex functions into smaller, single-purpose functions for better maintainability.",
  "Leverage version control (e.g., Git) and commit frequently with clear messages to track changes effectively.",
  "Write unit tests to catch bugs early and ensure your code behaves as expected.",
  "Use comments sparingly; focus on making your code self-explanatory through clear structure and naming.",
  "Learn keyboard shortcuts for your IDE to boost productivity, like Ctrl+Shift+F for global search.",
  "Regularly refactor your code to eliminate technical debt and improve performance.",
  "Use linters and formatters (e.g., ESLint, Prettier) to enforce consistent coding styles.",
  "Understand time complexity (e.g., O(n) vs O(n²)) to write efficient algorithms.",
  "Back up your work regularly and use cloud storage to prevent data loss.",
  "Practice defensive programming by validating inputs to prevent unexpected errors.",
  "Keep your dependencies updated, but test thoroughly to avoid breaking changes.",
  "Use environment variables to store sensitive data like API keys securely.",
  "Profile your application to identify and optimize performance bottlenecks.",
  "Read documentation thoroughly before integrating a new library or framework.",
  "Pair program with a colleague to share knowledge and catch mistakes early.",
  "Use `const` by default in JavaScript, and only use `let` when reassignment is needed.",
  "Learn to use debugging tools like breakpoints and watch variables to troubleshoot effectively.",
  "Write clear error messages that help users understand and resolve issues.",
  "Stay curious and experiment with new tools or languages to broaden your skillset.",
];

const getRandomTip = () => {
  const index = Math.floor(Math.random() * devTips.length);
  return devTips[index];
};

const App = () => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [warning, setWarning] = useState("");
  const [language, setLanguage] = useState("english");
  const [devTip, setDevTip] = useState("");

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
  useEffect(() => {
    setDevTip(getRandomTip);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 {translations[language].title}</h2>
      <div style={styles.languageContainer}>
        <h3>{translations[language].languageLabel}</h3>
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
      <div style={styles.devTipContainer}>
        <h3 style={styles.devHeading}>dev TIPS</h3>
        <p>{devTip}</p>
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
  devTipContainer: {
    textAlign: "center",
    padding: "5px 20px",
    fontSize: "18px",
    fontWeight: "600",
    backgroundImage: `url("https://i.ibb.co/hFhHCgNV/background.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "12px",
    margin: "30px 0",
    color: "#374151",
  },
  devHeading: {
    fontFamily: "'Georgia', serif",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
};

export default App;
