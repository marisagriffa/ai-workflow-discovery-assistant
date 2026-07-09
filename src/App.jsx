import { useMemo, useState } from "react";
import { analyzeWorkflow, sampleNotes } from "./workflowAnalyzer.js";

const sectionMeta = [
  { key: "currentWorkflow", title: "Current workflow", tone: "teal", icon: "flow" },
  { key: "bottlenecks", title: "Bottlenecks", tone: "red", icon: "alert" },
  { key: "requirements", title: "Requirements", tone: "blue", icon: "list" },
  { key: "userStories", title: "User stories", tone: "violet", icon: "user" },
  { key: "acceptanceCriteria", title: "Acceptance criteria", tone: "green", icon: "check" },
  { key: "automationOpportunities", title: "AI automation opportunities", tone: "teal", icon: "spark" },
  { key: "humanReviewPoints", title: "Human review points", tone: "amber", icon: "personCheck" },
  { key: "testScenarios", title: "Test scenarios", tone: "blue", icon: "flask" },
  { key: "implementationImpact", title: "Implementation Impact", tone: "green", icon: "chart" }
];

function App() {
  const [notes, setNotes] = useState(sampleNotes);
  const [analysis, setAnalysis] = useState(() => analyzeWorkflow(sampleNotes));
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [history, setHistory] = useState(() => [analyzeWorkflow(sampleNotes)]);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Demo brief generated from sample notes.");

  const stats = useMemo(() => {
    const trimmed = notes.trim();
    return {
      characters: trimmed.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0
    };
  }, [notes]);

  const analysisText = useMemo(() => formatAnalysisForExport(analysis), [analysis]);

  function handleAnalyze() {
    const nextAnalysis = analyzeWorkflow(notes);
    setAnalysis(nextAnalysis);
    setHasAnalyzed(true);
    setHistory((items) => [nextAnalysis, ...items].slice(0, 6));
    setStatusMessage("Workflow brief refreshed with adoption guidance.");
  }

  function handleClear() {
    setNotes("");
    setAnalysis(analyzeWorkflow(""));
    setHasAnalyzed(false);
    setStatusMessage("Ready for a new workflow discovery session.");
  }

  function handleRestoreHistory() {
    const previous = history[1] ?? history[0];

    if (!previous) {
      setStatusMessage("No previous analyses yet.");
      return;
    }

    setAnalysis(previous);
    setHasAnalyzed(true);
    setStatusMessage("Most recent historical analysis restored.");
  }

  function handleSaveAnalysis() {
    setSavedAnalyses((items) => [analysis, ...items].slice(0, 8));
    setStatusMessage("Analysis saved for portfolio review.");
  }

  async function handleCopyResult() {
    try {
      await navigator.clipboard.writeText(analysisText);
      setStatusMessage("Analysis copied to clipboard.");
    } catch {
      setStatusMessage("Copy was blocked by the browser. Export is still available.");
    }
  }

  function handleExportAnalysis() {
    const file = new Blob([analysisText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-workflow-discovery-analysis.txt";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Analysis exported as a text file.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="spark" />
          </span>
          <div>
            <h1>AI Workflow Discovery Assistant</h1>
            <p>Turn messy process notes into an operator-ready AI workflow brief.</p>
          </div>
        </div>
        <nav className="topbar-actions" aria-label="Analysis workspace">
          <button className="ghost-button" type="button" onClick={handleRestoreHistory}>
            <Icon name="clock" />
            History
          </button>
          <button className="ghost-button" type="button" onClick={handleSaveAnalysis}>
            <Icon name="bookmark" />
            Saved analyses
            <span className="count-badge">{savedAnalyses.length}</span>
          </button>
          <button className="new-analysis-button" type="button" onClick={handleClear}>
            <Icon name="plus" />
            New analysis
          </button>
        </nav>
      </header>

      <section className="workspace" aria-label="Workflow discovery workspace">
        <aside className="input-panel">
          <div className="panel-heading">
            <span className="step-icon">
              <Icon name="note" />
            </span>
            <div>
              <h2>1. Paste or type your business process notes</h2>
              <p>Add the current steps, teams, tools, pain points, and target outcome.</p>
            </div>
          </div>

          <label className="notes-label" htmlFor="business-notes">
            Business notes
          </label>
          <textarea
            id="business-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Example: Sales reps collect intake details in email, copy data into a CRM, then wait for manager approval..."
          />

          <div className="notes-footer">
            <span>
              {stats.characters} characters <span aria-hidden="true">/</span> {stats.words} words
            </span>
            <button type="button" className="link-button" onClick={handleClear}>
              Clear
            </button>
          </div>

          <div className="options-area">
            <button className="analyze-button" type="button" onClick={handleAnalyze}>
              <Icon name="spark" />
              Analyze Workflow
            </button>
            <p className="privacy-note">
              <Icon name="lock" />
              Local demo logic only. Connect a model later when you are ready.
            </p>
            <p className="status-note" role="status">
              {statusMessage}
            </p>
          </div>
        </aside>

        <section className="results-panel" aria-live="polite">
          <div className="results-header">
            <div>
              <span className="results-kicker">Analysis results</span>
              <h2>{hasAnalyzed ? "Workflow discovery brief" : "Ready for analysis"}</h2>
            </div>
            <div className="result-actions" aria-label="Result actions">
              <button className="outline-button" type="button" onClick={handleCopyResult}>
                <Icon name="copy" />
                Copy result
              </button>
              <button className="outline-button" type="button" onClick={handleExportAnalysis}>
                <Icon name="download" />
                Export analysis
              </button>
              <button className="outline-button strong" type="button" onClick={handleAnalyze}>
                <Icon name="spark" />
                Regenerate
              </button>
            </div>
          </div>

          <div className="results-list">
            {sectionMeta.map((section) => (
              <AnalysisSection
                key={section.key}
                icon={section.icon}
                tone={section.tone}
                title={section.title}
                items={analysis[section.key]}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function formatAnalysisForExport(analysis) {
  return sectionMeta
    .map((section) => {
      const items = analysis[section.key] ?? [];
      return `${section.title}\n${items.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n\n");
}

function AnalysisSection({ title, items, tone, icon }) {
  return (
    <article className="analysis-row">
      <div className={`section-title ${tone}`}>
        <Icon name={icon} />
        <h3>{title}</h3>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function Icon({ name }) {
  const icons = {
    alert: <path d="M12 3 2 20h20L12 3Zm0 6v5m0 3h.01" />,
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    chart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-7" />,
    check: <path d="M20 6 9 17l-5-5" />,
    clock: <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    copy: <path d="M8 8h11v11H8zM5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1" />,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
    flask: <path d="M9 3h6m-5 0v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3m-6 12h8" />,
    flow: <path d="M7 7h10v6H7zM4 10H2m20 0h-2M12 13v4m-3 0h6" />,
    list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    lock: <path d="M7 11V8a5 5 0 0 1 10 0v3m-12 0h14v10H5V11Z" />,
    note: <path d="M6 3h9l5 5v13H6V3Zm9 0v5h5M9 13h6M9 17h4" />,
    personCheck: <path d="M16 19c0-2.2-2.7-4-6-4s-6 1.8-6 4m6-7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 3 2 2 4-5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    spark: <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z" />,
    user: <path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}

export default App;
