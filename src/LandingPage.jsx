import React, { useState } from "react";
import axios from "axios";

export default function AIFunTeaser() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBetaModeClick = () => {
    if (isLoggedIn) {
      setMessage("Already logged in!");
      return;
    }
    setShowPinModal(true);
    setMessage("");
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setMessage("Please enter a pin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/verify-beta-pin', {
        pin: pin.trim()
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        setMessage("Logged in");
        setShowPinModal(false);
        setPin("");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Connection error. Make sure the server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closePinModal = () => {
    setShowPinModal(false);
    setPin("");
    setMessage("");
  };
  return (
    <section className="ai-hero" aria-label="AI Fun Teaser">
      <div className="ai-hero__bg" aria-hidden="true">
        <span className="ai-hero__orb ai-hero__orb--one" />
        <span className="ai-hero__orb ai-hero__orb--two" />
        <span className="ai-hero__swirl" />
        <span className="ai-hero__vignette" />
        <span className="ai-hero__noise" />
      </div>

      <div className="ai-hero__inner">
        <h1 className="ai-hero__title">The wait is going to be over</h1>
        <p className="ai-hero__subtitle">Let's have fun with AI ✨</p>
        
        {/* Beta Mode Button */}
        <div className="ai-hero__beta-section">
          <button
            className="ai-hero__beta-btn"
            onClick={handleBetaModeClick}
          >
            {isLoggedIn ? "✓ Beta Mode Active" : "🔐 Beta Mode"}
          </button>
          {message && (
            <p className={`ai-hero__message ${isLoggedIn ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Pin Modal */}
      {showPinModal && (
        <div className="ai-hero__modal-overlay" onClick={closePinModal}>
          <div className="ai-hero__modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Beta Pin</h3>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter secret pin"
                className="ai-hero__pin-input"
                disabled={isLoading}
                autoFocus
              />
              <div className="ai-hero__modal-buttons">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ai-hero__submit-btn"
                >
                  {isLoading ? "Verifying..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={closePinModal}
                  className="ai-hero__cancel-btn"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <a
        href="https://github.com/abdulahadmalik1"
        target="_blank"
        rel="noopener noreferrer"
        className="ai-hero__credit"
      >
        By: AbdulAhadMalik
      </a>

      <style>{`
        :root {
          --bg-0: #07070b;
          --bg-1: #0c0b12;
          --c-cyan: #22d3ee;
          --c-magenta: #ff6ad5;
          --c-violet: #8b5cf6;
          --text: #eef0f6;
          --muted: rgba(238,240,246,.78);
        }

        .ai-hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          overflow: hidden;
          background: radial-gradient(100% 140% at 0% 0%, #0e0b17 0%, transparent 55%),
                      radial-gradient(120% 140% at 100% 0%, #0a1220 0%, transparent 55%),
                      linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%);
        }

        .ai-hero__inner {
          text-align: center;
          max-width: 920px;
          padding-inline: 1rem;
          z-index: 2;
        }

        .ai-hero__title {
          margin: 0;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.06;
          font-size: clamp(2rem, 6vw, 4rem);
          background: linear-gradient(90deg, var(--c-cyan), var(--c-magenta), var(--c-violet));
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 2px 18px rgba(139,92,246,.18));
        }

        .ai-hero__subtitle {
          margin: 14px 0 0 0;
          font-size: clamp(1rem, 2.2vw, 1.25rem);
          color: var(--muted);
        }

        .ai-hero__credit {
          position: absolute;
          bottom: 20px;
          right: 24px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color .3s;
          z-index: 3;
        }

        .ai-hero__credit:hover {
          color: var(--c-cyan);
        }

        .ai-hero__bg { position: absolute; inset: 0; z-index: 1; }

        .ai-hero__orb {
          position: absolute; border-radius: 999px; filter: blur(24px) saturate(120%);
          opacity: .28; mix-blend-mode: screen;
        }
        .ai-hero__orb--one { width: 520px; height: 520px; left: -120px; top: -120px; background: radial-gradient(circle at 30% 30%, var(--c-cyan), transparent 60%); }
        .ai-hero__orb--two { width: 560px; height: 560px; right: -160px; top: -80px; background: radial-gradient(circle at 70% 30%, var(--c-violet), transparent 60%); }

        .ai-hero__swirl {
          position: absolute; inset: -30% -30%;
          background: conic-gradient(from 200deg at 50% 50%, transparent 0 35%, rgba(255,255,255,.06) 40%, transparent 60%, rgba(255,255,255,.04) 75%, transparent 100%);
          animation: spin 40s linear infinite;
          opacity: .35; filter: blur(40px);
        }

        .ai-hero__vignette { position: absolute; inset: 0; box-shadow: inset 0 0 140px 40px rgba(0,0,0,.65); }

        .ai-hero__noise { position: absolute; inset: 0; opacity: .035; background-image: url('data:image/svg+xml;utf8,\
          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">\
            <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>\
            <rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/>\
          </svg>'); mix-blend-mode: overlay; }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Beta Mode Styles */
        .ai-hero__beta-section {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .ai-hero__beta-btn {
          background: linear-gradient(135deg, var(--c-violet), var(--c-magenta));
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .ai-hero__beta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .ai-hero__beta-btn:active {
          transform: translateY(0);
        }

        .ai-hero__message {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .ai-hero__message.success {
          color: var(--c-cyan);
        }

        .ai-hero__message.error {
          color: var(--c-magenta);
        }

        /* Modal Styles */
        .ai-hero__modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .ai-hero__modal {
          background: linear-gradient(135deg, var(--bg-1), var(--bg-0));
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          min-width: 300px;
          max-width: 400px;
        }

        .ai-hero__modal h3 {
          margin: 0 0 1.5rem 0;
          color: var(--text);
          text-align: center;
          font-size: 1.25rem;
        }

        .ai-hero__pin-input {
          width: 100%;
          padding: 12px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.3);
          color: var(--text);
          font-size: 1rem;
          margin-bottom: 1.5rem;
          box-sizing: border-box;
        }

        .ai-hero__pin-input:focus {
          outline: none;
          border-color: var(--c-violet);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }

        .ai-hero__modal-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .ai-hero__submit-btn, .ai-hero__cancel-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ai-hero__submit-btn {
          background: linear-gradient(135deg, var(--c-violet), var(--c-magenta));
          color: white;
        }

        .ai-hero__submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .ai-hero__cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .ai-hero__cancel-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .ai-hero__submit-btn:disabled, .ai-hero__cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}