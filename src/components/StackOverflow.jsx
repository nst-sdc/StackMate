import React, { useState, useEffect } from "react";

const StackOverflow = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) return setSuggestions([]);
      try {
        const res = await fetch(
          `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&intitle=${encodeURIComponent(
            query
          )}&site=stackoverflow&pagesize=10`
        );
        const data = await res.json();
        setSuggestions(data.items);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    const timer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectQuestion = async (q) => {
    setQuery("");
    setSuggestions([]);
    setSelectedQuestion(null);
    setAnswers([]);
    setCurrentAnswerIndex(0);
    try {
      const [qRes, aRes] = await Promise.all([
        fetch(
          `https://api.stackexchange.com/2.3/questions/${q.question_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody`
        ),
        fetch(
          `https://api.stackexchange.com/2.3/questions/${q.question_id}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=10`
        ),
      ]);
      const qData = await qRes.json();
      const aData = await aRes.json();
      setSelectedQuestion(qData.items[0]);
      setAnswers(aData.items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        <span style={{ color: "#f48024", marginRight: 8 }}>⬆️</span>{" "}
        StackOverflow Search
      </h2>
      <div style={styles.searchBoxWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search StackOverflow..."
          style={styles.input}
        />
        <span style={styles.searchIcon}>🔍</span>
      </div>

      {suggestions.length > 0 && (
        <div style={styles.suggestions}>
          {suggestions.map((s) => (
            <div
              key={s.question_id}
              style={styles.suggestionItem}
              onClick={() => handleSelectQuestion(s)}
            >
              <span style={{ fontWeight: 500, color: "black" }}>{s.title}</span>
              <div style={styles.suggestionMeta}>
                <span style={styles.suggestionScore}>⬆️ {s.score}</span>
                {s.tags && (
                  <span style={styles.suggestionTags}>
                    {s.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQuestion && (
        <div style={styles.card}>
          <h3 style={styles.questionTitle}>{selectedQuestion.title}</h3>
          <div style={styles.questionMeta}>
            <span style={styles.questionScore}>
              ⬆️ {selectedQuestion.score} votes
            </span>
            {selectedQuestion.tags && (
              <span style={styles.suggestionTags}>
                {selectedQuestion.tags.map((tag) => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </span>
            )}
            {selectedQuestion.owner && (
              <span style={styles.owner}>
                <img
                  src={selectedQuestion.owner.profile_image}
                  alt="user"
                  style={styles.avatar}
                />
                {selectedQuestion.owner.display_name}
              </span>
            )}
          </div>
          <div
            style={styles.body}
            dangerouslySetInnerHTML={{ __html: selectedQuestion.body }}
          />
        </div>
      )}

      {answers.length > 0 && (
        <div style={styles.carousel}>
          <div style={styles.carouselHeader}>
            <button
              onClick={() => setCurrentAnswerIndex((i) => Math.max(0, i - 1))}
              disabled={currentAnswerIndex === 0}
              style={styles.carouselBtn}
            >
              ⬅️
            </button>
            <span style={styles.carouselCount}>
              {currentAnswerIndex + 1} / {answers.length}
            </span>
            <button
              onClick={() =>
                setCurrentAnswerIndex((i) =>
                  Math.min(answers.length - 1, i + 1)
                )
              }
              disabled={currentAnswerIndex === answers.length - 1}
              style={styles.carouselBtn}
            >
              ➡️
            </button>
          </div>
          <div
            style={{
              ...styles.answerCard,
              background: answers[currentAnswerIndex].is_accepted
                ? "#e6f7e6"
                : "#f9f9f9",
              border: answers[currentAnswerIndex].is_accepted
                ? "2px solid #4caf50"
                : "1px solid #ddd",
            }}
          >
            <div style={styles.answerHeader}>
              {answers[currentAnswerIndex].is_accepted ? (
                <span style={{ color: "#4caf50", fontWeight: 700 }}>
                  ✅ Accepted Answer
                </span>
              ) : (
                <span style={{ color: "#888" }}>Answer</span>
              )}
              <span style={styles.answerScore}>
                &nbsp;⬆️ {answers[currentAnswerIndex].score} votes
              </span>
              {answers[currentAnswerIndex].owner && (
                <span style={styles.owner}>
                  <img
                    src={answers[currentAnswerIndex].owner.profile_image}
                    alt="user"
                    style={styles.avatar}
                  />
                  {answers[currentAnswerIndex].owner.display_name}
                </span>
              )}
            </div>
            <div
              style={styles.body}
              dangerouslySetInnerHTML={{
                __html: answers[currentAnswerIndex].body,
              }}
            />
          </div>
        </div>
      )}

      <style>
        {`
          p { margin: 0 0 6px 0; }
          pre { background: #f6f8fa; padding: 6px; border-radius: 4px; }
          code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
          a { color: #0074cc; }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
    padding: 24,
    maxWidth: 800,
    margin: "32px auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  heading: {
    textAlign: "center",
    marginBottom: 18,
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#000000",
  },
  searchBoxWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "12px 40px 12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #f48024",
    outline: "none",
    boxSizing: "border-box",
    background: "#f9f9f9",
    transition: "border 0.2s",
  },
  searchIcon: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 20,
    color: "#f48024",
    pointerEvents: "none",
  },
  suggestions: {
    border: "1.5px solid #f48024",
    borderRadius: 8,
    marginTop: 2,
    background: "#fff",
    maxHeight: 260,
    overflowY: "auto",
    boxShadow: "0 2px 12px rgba(244,128,36,0.08)",
    zIndex: 10,
    position: "absolute",
    width: "100%",
  },
  suggestionItem: {
    padding: "12px 10px 8px 10px",
    cursor: "pointer",
    borderBottom: "1px solid #f3f3f3",
    fontSize: 15,
    background: "#fff",
    transition: "background 0.15s",
    position: "relative",
  },
  suggestionMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  suggestionScore: {
    color: "#f48024",
    fontWeight: 600,
    fontSize: 13,
  },
  suggestionTags: {
    marginLeft: 8,
    display: "flex",
    gap: 4,
  },
  tag: {
    background: "#f3f3f3",
    color: "#39739d",
    borderRadius: 4,
    padding: "2px 7px",
    fontSize: 12,
    marginRight: 2,
    fontWeight: 500,
  },
  card: {
    marginTop: 28,
    padding: 20,
    background: "#fdf7e2",
    border: "1.5px solid #f48024",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(244,128,36,0.08)",
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: "#222",
  },
  questionMeta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  questionScore: {
    color: "#f48024",
    fontWeight: 600,
    fontSize: 15,
  },
  owner: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#555",
    marginLeft: 8,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #eee",
  },
  body: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 1.6,
    background: "#fff",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    color: "#222",
    overflowX: "auto",
  },
  carousel: { marginTop: 28 },
  carouselHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 16,
  },
  carouselBtn: {
    background: "#f48024",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 16px",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.2s",
    outline: "none",
    boxShadow: "0 1px 4px rgba(244,128,36,0.08)",
    opacity: 1,
    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  carouselCount: {
    fontWeight: 600,
    fontSize: 15,
    color: "#f48024",
  },
  answerCard: {
    padding: 18,
    borderRadius: 10,
    minHeight: 120,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    marginBottom: 8,
  },
  answerHeader: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  answerScore: {
    color: "#f48024",
    fontWeight: 600,
    fontSize: 14,
  },
};

export default StackOverflow;
