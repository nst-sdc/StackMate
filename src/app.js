import React, { useState, useEffect } from "react";
import StackOverflow from "./components/StackOverflow.jsx";
import { jsPDF } from "jspdf";

const translations = {
  english: {
    title: "VS Code Notes",
    placeholder: "Write your thoughts...",
    saveButton: "Save Note",
    clearButton: "Clear All",
    saveNote: "Saved Notes",
    languageLabel: "Language:",
    pin: "Pin",
    jsonValidator: "JSON Validator & Formatter",
    jsonPlaceholder: "Paste or type your JSON here...",
    validateButton: "Validate JSON",
    beautifyButton: "Beautify JSON",
    clearJsonButton: "Clear JSON",
    validJson: "✅ Valid JSON",
    invalidJson: "❌ Invalid JSON:",
    beautifiedJson: "Beautified JSON:",
    copyJsonButton: "Copy JSON",
  },
  hindi: {
    title: "VS कोड नोट्स",
    placeholder: "अपने विचार लिखें...",
    saveButton: "नोट सहेजें",
    clearButton: "सब साफ करें",
    saveNote: "सहेजे गए नोट्स",
    languageLabel: "भाषा:",
    pin: "पिन करें",
    jsonValidator: "JSON सत्यापनकर्ता और फॉर्मेटर",
    jsonPlaceholder: "अपना JSON यहाँ पेस्ट या टाइप करें...",
    validateButton: "JSON सत्यापित करें",
    beautifyButton: "JSON को सुंदर बनाएं",
    clearJsonButton: "JSON साफ करें",
    validJson: "✅ वैध JSON",
    invalidJson: "❌ अवैध JSON:",
    beautifiedJson: "सुंदर JSON:",
    copyJsonButton: "JSON कॉपी करें",
  },
  spanish: {
    title: "Notas de VS Code",
    placeholder: "Escribe tus pensamientos...",
    saveButton: "Guardar Nota",
    clearButton: "Borrar Todo",
    saveNote: "Notas guardadas",
    languageLabel: "Idioma:",
    pin: "Fijar",
    jsonValidator: "Validador y Formateador JSON",
    jsonPlaceholder: "Pega o escribe tu JSON aquí...",
    validateButton: "Validar JSON",
    beautifyButton: "Embellecer JSON",
    clearJsonButton: "Limpiar JSON",
    validJson: "✅ JSON Válido",
    invalidJson: "❌ JSON Inválido:",
    beautifiedJson: "JSON Embellecido:",
    copyJsonButton: "Copiar JSON",
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

const showMessage = (message) => {
  // Create a temporary toast message
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 1000;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

const App = () => {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [warning, setWarning] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [selectedColor, setSelectedColor] = useState("#2B77BD");
  const [colorFormat, setColorFormat] = useState("hex");
  const [devTip, setDevTip] = useState("");
<<<<<<< feat/color-picker
=======
  const [searchQuery, setSearchQuery] = useState(""); 
  const [activeDownloadId, setActiveDownloadId] = useState(null);



  // JSON Validator states
>>>>>>> main
  const [jsonInput, setJsonInput] = useState("");
  const [jsonValidationResult, setJsonValidationResult] = useState("");
  const [beautifiedJson, setBeautifiedJson] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(null);

  useEffect(() => {
    // Note: localStorage is not available in VS Code webview context
    // You might need to use VS Code's state persistence instead
    try {
      const saved = localStorage.getItem("my-vscode-notes");
      if (saved) {
        setSavedNotes(JSON.parse(saved));
      }
    } catch (error) {
      console.log(`localStorage not available in VS Code context ${error}`);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("my-vscode-notes", JSON.stringify(savedNotes));
    } catch (error) {
      console.log(`localStorage not available in VS Code context ${error}`);
    }
  }, [savedNotes]);

  const handleSave = () => {
    if (note.trim() === "") {
      setWarning("Cannot save an empty note!");
      return;
    }
    const newNote = {
      id: Date.now(),
      content: note,
      pinned: false,
    };
    setSavedNotes((prev) => {
      const pinned = prev.filter((n) => n.pinned);
      const unpinned = prev.filter((n) => !n.pinned);
      return [...pinned, newNote, ...unpinned];
    });
    setNote("");
    setWarning("");
    showMessage("✅ Note Saved!");
  };

  const handleClear = () => {
    try {
      localStorage.removeItem("my-vscode-notes");
    } catch (error) {
      console.log(`localStorage not available in VS Code context ${error}`);
    }
    setSavedNotes([]);
    setWarning("");
  };

  const togglePin = (id) => {
    setSavedNotes((prev) =>
      prev
        .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
        .sort((a, b) => b.pinned - a.pinned || b.id - a.id)
    );
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleCopyColor = () => {
    const colorValue =
      colorFormat === "hex" ? selectedColor : hexToRgb(selectedColor);
    navigator.clipboard.writeText(colorValue);
    showMessage(
      `${colorFormat.toUpperCase()} ${colorValue} copied to clipboard!`
    );
  };

  // JSON Validator functions
  const validateJson = () => {
    if (!jsonInput.trim()) {
      setJsonValidationResult("Please enter some JSON to validate.");
      setIsJsonValid(false);
      return;
    }

    try {
      JSON.parse(jsonInput);
      setJsonValidationResult(translations[language].validJson);
      setIsJsonValid(true);
    } catch (error) {
      setJsonValidationResult(`${translations[language].invalidJson} ${error.message}`);
      setIsJsonValid(false);
    }
  };

  const beautifyJson = () => {
    if (!jsonInput.trim()) {
      setBeautifiedJson("Please enter some JSON to beautify.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setBeautifiedJson(formatted);
      setJsonValidationResult(translations[language].validJson);
      setIsJsonValid(true);
    } catch (error) {
      setBeautifiedJson(`Error: ${error.message}`);
      setJsonValidationResult(`${translations[language].invalidJson} ${error.message}`);
      setIsJsonValid(false);
    }
  };

  const clearJson = () => {
    setJsonInput("");
    setJsonValidationResult("");
    setBeautifiedJson("");
    setIsJsonValid(null);
  };

  const copyBeautifiedJson = () => {
    if (beautifiedJson && isJsonValid) {
      navigator.clipboard.writeText(beautifiedJson);
      showMessage("✅ JSON copied to clipboard!");
    }
  };

  useEffect(() => {
    setDevTip(getRandomTip());
  }, []);

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
  const Downloadnotes = (format, content) => {
    const file = `note_${new Date().toISOString().slice(0, 19)}.${format}`;
    if (format === "pdf") {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 10, 10);
      doc.save(file);
    } else {
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file;
      link.click();
    }
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
          <option value="spanish">Español</option>
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
        style={styleTextArea}
      ></textarea>

      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 {translations[language].saveButton}
        </button>
        <button onClick={handleClear} style={styles.clearBtn}>
          🧹 {translations[language].clearButton}
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={styleToggleButton}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {warning && <div style={styles.warning}>{warning}</div>}
      {savedNotes.length > 0 && (
  <div style={{ marginBottom: "15px" }}>
    <input
      type="text"
      placeholder="🔍 Search Notes..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        width: "95%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        marginTop: "20px",
        marginBottom: "10px",
        backgroundColor: darkMode ? "#1e1e1e" : "#fff",
        color: darkMode ? "#fff" : "#000",
      }}
    />
  </div>
)}


      {savedNotes.length > 0 && (
        <div style={styleSavedNotes}>
          <strong>🗒️ {translations[language].saveNote}:</strong>
          {savedNotes.filter((n) =>
            n.content.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((n) => (
            <div key={n.id} style={styles.noteItem}>
              <div style={styles.noteContent}>
                  <p style={{ margin: 0, flex: 1 }}>{n.content}</p>

                  <div style={{ position: "relative", display: "inline-block" }}>
  <button
    onClick={() =>
      setActiveDownloadId(activeDownloadId === n.id ? null : n.id)
    }
    style={{
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    ⬇️ Download
  </button>

  {activeDownloadId === n.id && (
    <div
      style={{
        position: "absolute", // make it float
        top: "110%",
        left: "0",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 20,
        padding: "10px",
        minWidth: "120px",
      }}
    >
      <button
        onClick={() => {
          Downloadnotes("txt", n.content);
          setActiveDownloadId(null);
        }}
        style={styles.dropdownButtonStyle}
      >
        .txt
      </button>
      <button
        onClick={() => {
          Downloadnotes("md", n.content);
          setActiveDownloadId(null);
        }}
        style={styles.dropdownButtonStyle}
      >
        .md
      </button>
      <button
        onClick={() => {
          Downloadnotes("pdf", n.content);
          setActiveDownloadId(null);
        }}
        style={styles.dropdownButtonStyle}
      >
        .pdf
      </button>
    </div>
  )}
</div>


                <button
                  onClick={() => togglePin(n.id)}
                  style={{
                    ...styles.pinBtn,
                    backgroundColor: n.pinned ? "#ffd966" : "#e0e0e0",
                  }}
                >
                  📌 {n.pinned ? "Pinned" : translations[language].pin}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rest of the component remains the same */}
      {/* JSON Validator section */}
      <div style={{
        marginTop: "40px",
        padding: "25px",
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        border: darkMode ? "2px solid #555" : "2px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{
          fontSize: "20px",
          marginBottom: "20px",
          color: darkMode ? "#ffffff" : "#2B77BD",
          textAlign: "center",
          borderBottom: darkMode ? "2px solid #555" : "2px solid #ddd",
          paddingBottom: "10px"
        }}>
          🔧 {translations[language].jsonValidator}
        </h3>

        {/* JSON input textarea */}
        <textarea
          placeholder={translations[language].jsonPlaceholder}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          style={{
            width: "100%",
            height: "150px",
            padding: "15px",
            fontSize: "14px",
            fontFamily: "Consolas, Monaco, 'Courier New', monospace",
            borderRadius: "8px",
            border: darkMode ? "2px solid #555" : "2px solid #ccc",
            backgroundColor: darkMode ? "#2a2a2a" : "#fff",
            color: darkMode ? "#fff" : "#000",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box"
          }}
        ></textarea>

        {/* JSON action buttons */}
        <div style={{
          marginTop: "15px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <button onClick={validateJson} style={styles.validateBtn}>
            {translations[language].validateButton}
          </button>
          <button onClick={beautifyJson} style={styles.beautifyBtn}>
            ✨ {translations[language].beautifyButton}
          </button>
          <button onClick={clearJson} style={styles.clearJsonBtn}>
            🧹 {translations[language].clearJsonButton}
          </button>
        </div>

        {/* JSON validation result */}
        {jsonValidationResult && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            color: isJsonValid ? "#4CAF50" : "#f44336",
            backgroundColor: darkMode ? "#2a2a2a" : "#f9f9f9",
            border: `2px solid ${isJsonValid ? "#4CAF50" : "#f44336"}`
          }}>
            {jsonValidationResult}
          </div>
        )}

        {/* Beautified JSON output */}
        {beautifiedJson && isJsonValid && (
          <div style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: darkMode ? "#2a2a2a" : "#f8f9fa",
            border: darkMode ? "2px solid #555" : "2px solid #ddd",
            borderRadius: "8px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              borderBottom: darkMode ? "1px solid #555" : "1px solid #ddd",
              paddingBottom: "10px"
            }}>
              <h4 style={{
                margin: 0,
                color: darkMode ? "#ffffff" : "#333",
                fontSize: "16px"
              }}>
                {translations[language].beautifiedJson}
              </h4>
              <button onClick={copyBeautifiedJson} style={styles.copyBtn}>
                📋 {translations[language].copyJsonButton}
              </button>
            </div>
            <pre style={{
              padding: "20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontFamily: "Consolas, Monaco, 'Courier New', monospace",
              overflow: "auto",
              maxHeight: "400px",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              margin: 0,
              backgroundColor: darkMode ? "#0d1117" : "#ffffff",
              color: darkMode ? "#e6edf3" : "#24292f",
              border: darkMode ? "1px solid #30363d" : "1px solid #e1e4e8"
            }}>
              {beautifiedJson}
            </pre>
          </div>
        )}
      </div>

      {/* Color picker section */}
      <div style={{ marginTop: "30px" }}>
        <label
          htmlFor="colorPicker"
          style={{ marginRight: "10px", fontSize: "15px" }}
        >
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
      <StackOverflow />
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
    fontFamily: "monospace",
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
  validateBtn: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  beautifyBtn: {
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  clearJsonBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  copyBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
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
    marginLeft: "8px",
  },
  languageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  noteItem: {
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  noteContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  pinBtn: {
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "background-color 0.3s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  devTipContainer: {
    textAlign: "center",
    padding: "24px 32px",
    fontSize: "16px",
    fontWeight: "500",
    background: "linear-gradient(90deg, #1F2937 0%, #374151 100%)",
    border: "1px solid rgba(255, 255, 0.1)",
    borderRadius: "12px",
    margin: "32px 0",
    color: "#F9FAFB",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  devHeading: {
    fontFamily: "'Inter', -apple-system, Roboto, sans-serif",
    fontSize: "1.25rem",
    fontWeight: "700",
    letterSpacing: "0.1px",
    color: "#FFFFFF",
  },
<<<<<<< feat/color-picker
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
=======
  dropdownButtonStyle: {
    display: "block",
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "white",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
    marginBottom: "5px",
    zIndex : "20"
  }
>>>>>>> main
};

export default App;