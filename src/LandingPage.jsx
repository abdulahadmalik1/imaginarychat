import React from "react";

export default function AIFunTeaser() {
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
        <p className="ai-hero__subtitle">Let’s have fun with AI ✨</p>
      </div>

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
      `}</style>
    </section>
  );
}