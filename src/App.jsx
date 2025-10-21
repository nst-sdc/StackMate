import React, { useState } from "react";
import {
  Search,
  StickyNote,
  FileText,
  ExternalLink,
  Sun,
  Moon,
  Languages,
  BrushCleaning,
  ChartNoAxesCombined,
  Puzzle,
} from "lucide-react";

import LanguageSelector from "./components/LanguageSelector";
import DevTip from "./components/DevTip";
import NoteTaker from "./components/NoteTaker";
import SavedNotes from "./components/SavedNotes";
import JsonValidator from "./components/JsonValidator";
import ColorPicker from "./components/ColorPicker";
import StackOverflow from "./components/StackOverflow";
import ThemeToggle from "./components/ThemeToggle";
import InternetCheck from "./components/ConnectionStatus";

import CleanupTool from "./components/CleanupTool.jsx";
import CodingStats from "./components/CodingStats.jsx";
import PluginManager from "./components/PluginManager.jsx";

import { translations } from "./utils/translations.js";
import { useNotes } from "./utils/useNotes.js";

import "./App.css";
import "./components/PluginManager.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerType, setTriggerType] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    note,
    setNote,
    savedNotes,

    // filteredNotes,
    // searchTerm,
    // setSearchTerm,

    warning,
    handleSave,
    handleClear,
    togglePin,
    handleRenameNote,

    handleDeleteNote,

    handleEditNote,
  } = useNotes();

  const commonProps = { darkMode, language, translations };

  const parseTrigger = (input) => {
    const match = input.match(/^@(\w+)\s+(.*)$/);
    return match
      ? { trigger: match[1].toLowerCase(), query: match[2] }
      : { trigger: null, query: "" };
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const { trigger, query } = parseTrigger(value);
    setTriggerType(trigger);
    setQueryText(query);
    setShowSuggestions(value.startsWith("@") && !trigger);
  };

  const handleSuggestionClick = (trigger) => {
    setSearchQuery(`${trigger} `);
    setShowSuggestions(false);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setTriggerType(null);
    setQueryText("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      if (triggerType) {
        switch (triggerType) {
          case "stack":
            setActiveView("stackoverflow");
            break;
          case "json":
            setActiveView("json-validator");
            break;
          case "notes":
            setActiveView("notes");
            break;
          case "plugins":
            setActiveView("plugins");
            break;
          case "github":
            setActiveView("plugins");
            break;
          case "eslint":
            setActiveView("plugins");
            break;
          case "test":
            setActiveView("plugins");
            break;
          default:
            setActiveView("notes");
        }
      }
    }
  };

  const highlightTriggerWords = (text) =>
    text.split(/(@\w+)/g).map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="highlighted-trigger">
          {part}
        </span>
      ) : (
        part
      )
    );

  const handleToolClick = (tool) => setActiveView(tool);

  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "notes":
        return (
          <div className="space-y">
            <div className="tool-container">
              <NoteTaker
                note={note}
                setNote={setNote}
                onSave={handleSave}
                onClear={handleClear}
                warning={warning}
                {...commonProps}
              />
            </div>
            <div className="tool-container">
              <SavedNotes
                savedNotes={savedNotes}
                onRenameNote={handleRenameNote} //1
                onDeleteNote={handleDeleteNote} //2
                onEditNoteContent={handleEditNote} //3   1,2,3,5,4 teeno useNotes.jsx se aa raha hai
                onTogglePin={togglePin} //4
                searchquery={triggerType === "notes" ? queryText : ""} //5
                {...commonProps} // top me defined hai
              />
            </div>
          </div>
        );
      case "json-validator":
        return (
          <div className="tool-container">
            <JsonValidator
              query={triggerType === "json" ? queryText : ""}
              {...commonProps}
            />
          </div>
        );
      case "stackoverflow":
        return (
          <div className="tool-container">
            <StackOverflow
              query={triggerType === "stack" ? queryText : ""}
              {...commonProps}
            />
          </div>
        );
      case "cleanup":
        return (
          <div className="tool-container">
            <CleanupTool {...commonProps} />
          </div>
        );
      case "stats":
        return (
          <div className="tool-container">
            <CodingStats {...commonProps} />
          </div>
        );
      case "plugins":
        return (
          <div className="tool-container">
            <PluginManager {...commonProps} />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="tools-grid">
        <div onClick={() => handleToolClick("notes")} className="tool-card">
          <div className="tool-card-content">
            <StickyNote className="tool-icon" />
            <h3 className="tool-title">Notes</h3>
          </div>
        </div>
        <div
          onClick={() => handleToolClick("json-validator")}
          className="tool-card featured"
        >
          <div className="tool-card-content">
            <FileText className="tool-icon" />
            <h3 className="tool-title">JSON Validator</h3>
          </div>
        </div>
        <div
          onClick={() => handleToolClick("stackoverflow")}
          className="tool-card"
        >
          <div className="tool-card-content">
            <ExternalLink className="tool-icon" />
            <h3 className="tool-title">Stack Overflow</h3>
          </div>
        </div>
        <div onClick={() => handleToolClick("cleanup")} className="tool-card">
          <div className="tool-card-content">
            <BrushCleaning className="tool-icon" />
            <h3 className="tool-title">Cleanup Tool</h3>
          </div>
        </div>
        <div onClick={() => handleToolClick("stats")} className="tool-card">
          <div className="tool-card-content">
            <ChartNoAxesCombined className="tool-icon" />
            <h3 className="tool-title">Coding Stats</h3>
          </div>
        </div>
        <div
          onClick={() => handleToolClick("plugins")}
          className="tool-card featured"
        >
          <div className="tool-card-content">
            <Puzzle className="tool-icon" />
            <h3 className="tool-title">Plugin Manager</h3>
          </div>
        </div>
      </div>

      <div className="dev-tips-section">
        <h2 className="section-title">Dev Tips</h2>
        <div className="dev-tips-container">
          <DevTip />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            {/* Logo */}
            <img
              src={window.logoUri || "./logoo.png"}
              alt="Logo"
              className="logo-img"
            />

            <h1 className="app-title">
              {translations[language]?.title || "StackMate"}
            </h1>
          </div>

          <div className="header-controls">
            <InternetCheck darkMode={darkMode} />

            <div className="control-wrapper">
              <button
                className="control-button color-picker-button"
                onClick={handleColorPickerToggle}
              />
              {showColorPicker && (
                <div className="color-picker-popup">
                  <ColorPicker />
                </div>
              )}
            </div>

            <div className="control-wrapper hover-popup">
              <button className="control-button language-button">
                <Languages className="control-icon" />
              </button>
              <div className="popup-container">
                <LanguageSelector
                  language={language}
                  setLanguage={setLanguage}
                  translations={translations}
                />
              </div>
            </div>

            <div className="control-wrapper">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="control-button theme-button"
              >
                {darkMode ? (
                  <Sun className="control-icon" />
                ) : (
                  <Moon className="control-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        {activeView === "dashboard" && (
          <div className="search-wrapper">
            <Search className="search-icon" />
            <div className="search-highlight">
              {highlightTriggerWords(searchQuery)}
            </div>
            <textarea
              className="purple-placeholder"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="search with @stack @json @notes @plugins @github @eslint @test ..."
              rows={1}
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                backgroundColor: "#4b2e83",
                border: "none",
                borderRadius: "20px",
                outline: "none",
                resize: "none",
                color: "white",
                fontSize: "16px",
                padding: "16px 16px 16px 48px",
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            />
            {showSuggestions && (
              <ul className="trigger-suggestions">
                {[
                  "@stack",
                  "@json",
                  "@notes",
                  "@plugins",
                  "@github",
                  "@eslint",
                  "@test",
                ].map((trigger) => (
                  <li
                    key={trigger}
                    onClick={() => handleSuggestionClick(trigger)}
                  >
                    {trigger}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Back Button */}
        {activeView !== "dashboard" && (
          <button
            onClick={() => {
              setActiveView("dashboard");
              resetSearch();
            }}
            className="back-button"
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Main Content */}
        <div className="main-content">{renderActiveView()}</div>
      </div>

      {/* Hidden toggle */}
      <div className="hidden">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      {/* Overlay for color picker */}
      {showColorPicker && (
        <div
          className="color-picker-overlay"
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};

export default App;
