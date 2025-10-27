import React, { useState, useEffect } from "react";
import {
  SearchCode,
  ChevronLeft,
  ChevronRight,
  ArrowBigUp,
  CheckCheck,
} from "lucide-react";

const StackOverflow = ({ query: initialQuery = "", darkMode }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);

  // AI summary states
  const [acceptedAnswerSummary, setAcceptedAnswerSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarySource, setSummarySource] = useState("accepted"); 

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&intitle=${encodeURIComponent(
            query
          )}&site=stackoverflow&pagesize=10`
        );
        const data = await res.json();
        setSuggestions(data.items);
      } catch (err) {
        console.error("Error fetching StackOverflow suggestions:", err);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const handleSelectQuestion = async (question) => {
    setSelectedQuestion(null);
    setAnswers([]);
    setCurrentAnswerIndex(0);
    setAcceptedAnswerSummary("");
    setSummaryLoading(false);
    setSuggestions([]);

    try {
      const [qRes, aRes] = await Promise.all([
        fetch(
          `https://api.stackexchange.com/2.3/questions/${question.question_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody`
        ),
        fetch(
          `https://api.stackexchange.com/2.3/questions/${question.question_id}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=10`
        ),
      ]);
      const qData = await qRes.json();
      const aData = await aRes.json();
      setSelectedQuestion(qData.items[0]);
      setAnswers(aData.items);

      // ✅ NEW LOGIC (choose accepted OR fallback to best-voted)
      const accepted = aData.items.find((a) => a.is_accepted);
      const answerForSummary = accepted || aData.items[0];
      setSummarySource(accepted ? "accepted" : "fallback");
      if (answerForSummary) {
        setSummaryLoading(true);
        fetch("http://localhost:5070/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answerText: answerForSummary.body }),
        })
          .then((res) => res.json())
          .then((data) => {
            setAcceptedAnswerSummary(data.summary);
            setSummaryLoading(false);
          })
          .catch(() => setSummaryLoading(false));
      }
    } catch (err) {
      console.error("Error fetching StackOverflow data:", err);
    }
  };

  // Styles
  const headingStyle = {
    fontSize: 24,
    marginBottom: 20,
    color: "#e0b3ff",
    textAlign: "center",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
    paddingBottom: 10,
    fontWeight: 700,
  };
  const inputStyle = {
    backgroundColor: darkMode ? "#2e2e2e" : "#68338a",
    padding: "14px 18px",
    fontSize: 16,
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    outline: "none",
    marginBottom: suggestions.length > 0 ? 0 : 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    resize: "none",
    minHeight: 44,
    maxHeight: 80,
    fontFamily: "inherit",
    display: "block",
  };
  const suggestionListStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 10,
    background: darkMode ? "#232136" : "#68338a",
    border: darkMode ? "1.5px solid #30363d" : "1.5px solid #68338a",
    borderTop: "none",
    borderRadius: "0 0 12px 12px",
    maxHeight: 240,
    overflowY: "auto",
    boxShadow: darkMode
      ? "0 8px 24px rgba(0,0,0,0.35)"
      : "0 8px 24px rgba(104,51,138,0.10)",
    fontFamily: "inherit",
    padding: 0,
    margin: 0,
  };
  const suggestionItemStyle = {
    padding: "14px 18px",
    cursor: "pointer",
    borderBottom: darkMode ? "1px solid #30363d" : "1px solid #7c4dff",
    background: darkMode ? "#232136" : "#68338a",
    color: darkMode ? "#e0b3ff" : "#fff",
    fontSize: 15,
    borderRadius: 0,
    transition: "background 0.18s, color 0.18s",
    fontWeight: 500,
    outline: "none",
    userSelect: "none",
  };
  const suggestionItemHoverStyle = {
    background: darkMode ? "#393552" : "#7c4dff",
    color: "#fff",
  };
  const suggestionTitleStyle = {
    color: darkMode ? "#e0b3ff" : "#fff",
    fontSize: 14,
    display: "block",
    marginBottom: 4,
    fontWeight: 600,
  };
  const suggestionMetaStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  };
  const suggestionScoreStyle = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: darkMode ? "#a277ff" : "#ffe066",
    fontWeight: 600,
    fontSize: 13,
  };
  const suggestionTagsStyle = {
    display: "flex",
    gap: 6,
  };
  const tagStyle = {
    background: darkMode ? "#393552" : "#fff",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
    color: darkMode ? "#e0b3ff" : "#68338a",
    border: darkMode ? "1px solid #30363d" : "1px solid #e5e7eb",
    fontWeight: 500,
  };
  const cardStyle = {
    marginTop: 24,
    padding: 20,
    borderRadius: "12px",
    backgroundColor: darkMode ? "#2e2e2e" : "#68338a",
    color: darkMode ? "#fff" : "#374151",
  };
  const questionTitleStyle = {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: darkMode ? "#e0b3ff" : "#fff",
    textAlign: "center",
  };
  const questionMetaStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginBottom: 10,
    flexWrap: "wrap",
  };
  const questionScoreStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: darkMode ? "#e0b3ff" : "#fff",
    fontWeight: 600,
    fontSize: 16,
    margin: 0,
    padding: 0,
  };
  const ownerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: darkMode ? "#e0b3ff" : "#fff",
  };
  const avatarStyle = {
    width: 20,
    height: 20,
    borderRadius: "50%",
  };
  const bodyStyle = {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 1.6,
    background: "#1a1a1a",
    padding: 12,
    borderRadius: 6,
    color: "#e6edf3",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    maxHeight: 350,
    overflowY: "auto",
    wordBreak: "break-word",
    whiteSpace: "pre-line",
  };
  const carouselStyle = {
    marginTop: 24,
  };
  const carouselHeaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginBottom: 12,
  };
  const carouselBtnStyle = {
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 18,
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const carouselCountStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: darkMode ? "#e0b3ff" : "#fff",
  };
  const answerCardStyle = {
    padding: 20,
    borderRadius: 12,
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    color: darkMode ? "#e6edf3" : "#374151",
  };
  const answerHeaderStyle = {
    fontSize: 14,
    marginBottom: 8,
    display: "flex",
    gap: 10,
    alignItems: "center",
  };
  const answerScoreStyle = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: darkMode ? "#e0b3ff" : "#4b5563",
    fontWeight: 600,
  };

  // For suggestion hover rerender
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const rerender = () => forceUpdate((n) => n + 1);
    window.addEventListener("hoveredSuggestionChange", rerender);
    return () =>
      window.removeEventListener("hoveredSuggestionChange", rerender);
  }, []);

  return (
    <div>
      <h2 style={headingStyle}>StackOverflow Search</h2>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search StackOverflow..."
          style={inputStyle}
          rows={1}
        />
        <span
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            color: darkMode ? "#e0b3ff" : "#fff",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SearchCode size={20} />
        </span>
        {suggestions.length > 0 && (
          <div style={suggestionListStyle}>
            {suggestions.map((s, idx) => (
              <div
                key={s.question_id}
                style={{
                  ...suggestionItemStyle,
                  ...(window.__hoveredSuggestion === idx
                    ? suggestionItemHoverStyle
                    : {}),
                  borderBottomLeftRadius:
                    idx === suggestions.length - 1 ? 12 : 0,
                  borderBottomRightRadius:
                    idx === suggestions.length - 1 ? 12 : 0,
                }}
                onClick={() => handleSelectQuestion(s)}
                onMouseEnter={() => {
                  window.__hoveredSuggestion = idx;
                  window.dispatchEvent(new Event("hoveredSuggestionChange"));
                }}
                onMouseLeave={() => {
                  window.__hoveredSuggestion = null;
                  window.dispatchEvent(new Event("hoveredSuggestionChange"));
                }}
              >
                <strong style={suggestionTitleStyle}>{s.title}</strong>
                <div style={suggestionMetaStyle}>
                  <span style={suggestionScoreStyle}>
                    <ArrowBigUp size={16} style={{ verticalAlign: "middle" }} />
                    <span style={{ marginLeft: 4 }}>{s.score}</span>
                  </span>
                  <div style={suggestionTagsStyle}>
                    {s.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} style={tagStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedQuestion && (
        <div style={cardStyle}>
          <h3 style={questionTitleStyle}>{selectedQuestion.title}</h3>
          <div style={questionMetaStyle}>
            <p style={questionScoreStyle}>
              <ArrowBigUp size={22} style={{ marginRight: 2 }} />
              {selectedQuestion.score} votes
            </p>
            <div style={suggestionTagsStyle}>
              {selectedQuestion.tags?.map((tag) => (
                <span key={tag} style={tagStyle}>
                  {tag}
                </span>
              ))}
            </div>
            {selectedQuestion.owner && (
              <span style={ownerStyle}>
                <img
                  src={selectedQuestion.owner.profile_image}
                  alt="user"
                  style={avatarStyle}
                />
                {selectedQuestion.owner.display_name}
              </span>
            )}
          </div>
          <div
            style={bodyStyle}
            dangerouslySetInnerHTML={{ __html: selectedQuestion.body }}
          />
        </div>
      )}

      {/* Answer Summary */}
      {summaryLoading && (
        <p
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 10,
            background: "#393552",
            color: "#fff",
          }}
        >
          Generating summary...
        </p>
      )}

      {acceptedAnswerSummary && (
        <div
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 10,
            background: "#393552",
            color: "#fff",
          }}
        >
          <strong style={{ color: "#c3d10bff" }}>
            {summarySource === "accepted"
              ? "Accepted Answer Summary:"
              : "Top Voted Answer Summary:"}
          </strong>
          <p style={{ marginTop: 6 }}>{acceptedAnswerSummary}</p>
        </div>
      )}

      {answers.length > 0 && (
        <div style={carouselStyle}>
          <div style={carouselHeaderStyle}>
            <button
              onClick={() => setCurrentAnswerIndex((i) => Math.max(0, i - 1))}
              disabled={currentAnswerIndex === 0}
              style={carouselBtnStyle}
            >
              <ChevronLeft size={22} />
            </button>
            <span style={carouselCountStyle}>
              {currentAnswerIndex + 1} / {answers.length}
            </span>
            <button
              onClick={() =>
                setCurrentAnswerIndex((i) =>
                  Math.min(answers.length - 1, i + 1)
                )
              }
              disabled={currentAnswerIndex === answers.length - 1}
              style={carouselBtnStyle}
            >
              <ChevronRight size={22} />
            </button>
          </div>
          <div style={answerCardStyle}>
            <div style={answerHeaderStyle}>
              {answers[currentAnswerIndex].is_accepted ? (
                <span
                  style={{
                    color: "#00e676",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCheck size={16} />
                  Accepted Answer
                </span>
              ) : (
                <span style={{ color: darkMode ? "#e0b3ff" : "#374151" }}>
                  Answer
                </span>
              )}
              <span style={answerScoreStyle}>
                <ArrowBigUp size={16} />
                <span style={{ marginLeft: 4 }}>
                  {answers[currentAnswerIndex].score}
                </span>
              </span>
              {answers[currentAnswerIndex].owner && (
                <span style={ownerStyle}>
                  <img
                    src={answers[currentAnswerIndex].owner.profile_image}
                    alt="user"
                    style={avatarStyle}
                  />
                  {answers[currentAnswerIndex].owner.display_name}
                </span>
              )}
            </div>
            <div
              style={bodyStyle}
              dangerouslySetInnerHTML={{
                __html: answers[currentAnswerIndex].body,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StackOverflow;
