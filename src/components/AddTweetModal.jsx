import { useState, useEffect, useRef } from "react";
import { postCustomTweet, fetchLocations } from "../utils/api";
import "./AddTweetModal.css";

export default function AddTweetModal({ onClose }) {
  const [text, setText] = useState("");
  const [handle, setHandle] = useState("@citizen");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  
  const [allLocations, setAllLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetchLocations().then(setAllLocations).catch(console.error);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    if (val.length > 0) {
      const filtered = allLocations.filter(loc => loc.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await postCustomTweet(text, handle, location);

      if (response.accepted) {
        setStatus("success");
        setMessage("Report submitted and verified!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(`Rejected: ${response.reason}`);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="add-tweet-modal glass-panel">
        <div className="modal-header">
          <h3>Add Live Report</h3>
          <button
            className="close-btn"
            onClick={onClose}
            disabled={status === "loading"}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>User Handle</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@citizen"
              disabled={status === "loading"}
            />
          </div>

          <div className="form-group" ref={wrapperRef} style={{ position: "relative" }}>
            <label>Location (Optional)</label>
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              onFocus={() => location.length > 0 && setShowSuggestions(true)}
              placeholder="e.g. Guwahati"
              disabled={status === "loading"}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-dropdown">
                {suggestions.map((sug, i) => (
                  <li key={i} onClick={() => handleSelectSuggestion(sug)}>
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label>Report Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="E.g. Flash flood hitting the main market in Guwahati right now! Water level rising fast."
              rows={4}
              required
              disabled={status === "loading"}
            />
          </div>

          {message && (
            <div className={`status-message ${status}`}>
              {status === "success" ? "✅ " : "❌ "}
              {message}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={status === "loading"}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={status === "loading" || !text.trim()}
            >
              {status === "loading" ? "Processing..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
