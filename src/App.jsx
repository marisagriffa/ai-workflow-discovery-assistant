import { useMemo, useState } from "react";
import { analyzeWorkflow, generateUserStories, sampleNotes } from "./workflowAnalyzer.js";

const savedAnalysesStorageKey = "ai-workflow-discovery-saved-analyses-v1";
const maxSavedAnalyses = 8;

const sectionMeta = [
  { key: "currentWorkflow", title: "Current workflow", tone: "teal", icon: "flow" },
  { key: "bottlenecks", title: "Bottlenecks", tone: "red", icon: "alert" },
  { key: "requirements", title: "Requirements", tone: "blue", icon: "list" },
  { key: "automationOpportunities", title: "AI automation opportunities", tone: "teal", icon: "spark" },
  { key: "humanReviewPoints", title: "Human review points", tone: "amber", icon: "personCheck" },
  { key: "implementationImpact", title: "Implementation Impact", tone: "green", icon: "chart" }
];

function App() {
  const [notes, setNotes] = useState(sampleNotes);
  const [analysis, setAnalysis] = useState(() => analyzeWorkflow(sampleNotes));
  const [userStories, setUserStories] = useState(() =>
    generateUserStories(analyzeWorkflow(sampleNotes), sampleNotes)
  );
  const [areUserStoriesExpanded, setAreUserStoriesExpanded] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [savedAnalyses, setSavedAnalyses] = useState(loadSavedAnalyses);
  const [savedAnalysisId, setSavedAnalysisId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Demo brief generated from sample notes.");

  const stats = useMemo(() => {
    const trimmed = notes.trim();
    return {
      characters: trimmed.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0
    };
  }, [notes]);

  const analysisText = useMemo(() => formatAnalysisForExport(analysis), [analysis]);
  const currentAnalysisKey = useMemo(
    () => createAnalysisKey(notes, analysis, userStories),
    [notes, analysis, userStories]
  );
  const analysisSaveState = useMemo(
    () => getAnalysisSaveState(currentAnalysisKey, savedAnalysisId, savedAnalyses),
    [currentAnalysisKey, savedAnalysisId, savedAnalyses]
  );

  function handleAnalyze() {
    const nextAnalysis = analyzeWorkflow(notes);
    const nextStories = generateUserStories(nextAnalysis, notes);
    setAnalysis(nextAnalysis);
    setUserStories(nextStories);
    setAreUserStoriesExpanded(false);
    setHasAnalyzed(true);
    setSavedAnalysisId(null);
    setStatusMessage("Workflow brief refreshed with adoption guidance.");
  }

  function handleClear() {
    setNotes("");
    const nextAnalysis = analyzeWorkflow("");
    setAnalysis(nextAnalysis);
    setUserStories([]);
    setAreUserStoriesExpanded(false);
    setHasAnalyzed(false);
    setSavedAnalysisId(null);
    setStatusMessage("Ready for a new workflow discovery session.");
  }

  function handleSaveAnalysis() {
    if (analysisSaveState.isSaved) {
      setSavedAnalysisId(analysisSaveState.savedAnalysis.id);
      return;
    }

    if (analysisSaveState.savedAnalysis) {
      const updatedAnalysis = {
        ...analysisSaveState.savedAnalysis,
        updatedAt: new Date().toISOString(),
        notes,
        analysis,
        userStories
      };
      const nextSavedAnalyses = savedAnalyses.map((item) =>
        item.id === updatedAnalysis.id ? updatedAnalysis : item
      );
      const didPersist = persistSavedAnalyses(nextSavedAnalyses);

      setSavedAnalyses(nextSavedAnalyses);
      setSavedAnalysisId(updatedAnalysis.id);
      setStatusMessage(
        didPersist
          ? "Analysis saved."
          : "Saved analysis updated for this session. Browser storage was unavailable."
      );
      return;
    }

    const duplicateSavedAnalysis = savedAnalyses.find((item) => createSavedAnalysisKey(item) === currentAnalysisKey);

    if (duplicateSavedAnalysis) {
      setSavedAnalysisId(duplicateSavedAnalysis.id);
      return;
    }

    const savedAnalysis = createSavedAnalysis(notes, analysis, userStories);
    const nextSavedAnalyses = [savedAnalysis, ...savedAnalyses].slice(0, maxSavedAnalyses);
    const didPersist = persistSavedAnalyses(nextSavedAnalyses);

    setSavedAnalyses(nextSavedAnalyses);
    setSavedAnalysisId(savedAnalysis.id);
    setStatusMessage(
      didPersist
        ? "Analysis saved and will remain available after refresh."
        : "Analysis saved for this session. Browser storage was unavailable."
    );
  }

  function handleRestoreSavedAnalysis(savedAnalysis) {
    setNotes(savedAnalysis.notes);
    setAnalysis(savedAnalysis.analysis);
    setUserStories(savedAnalysis.userStories ?? []);
    setAreUserStoriesExpanded(false);
    setHasAnalyzed(true);
    setSavedAnalysisId(savedAnalysis.id);
    queuePageTopScroll();
    setStatusMessage(`Restored saved analysis from ${formatSavedDate(savedAnalysis.createdAt)}.`);
  }

  function handleDeleteSavedAnalysis(savedAnalysisId) {
    const nextSavedAnalyses = savedAnalyses.filter((savedAnalysis) => savedAnalysis.id !== savedAnalysisId);
    const didPersist = persistSavedAnalyses(nextSavedAnalyses);

    setSavedAnalyses(nextSavedAnalyses);
    setSavedAnalysisId((currentId) => (currentId === savedAnalysisId ? null : currentId));
    setStatusMessage(
      didPersist
        ? "Saved analysis deleted."
        : "Saved analysis deleted for this session. Browser storage was unavailable."
    );
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

  async function handleCopyStory(story) {
    try {
      await navigator.clipboard.writeText(`${story.id} - ${story.title}\n${story.storyText}`);
      setStatusMessage(`${story.id} copied to clipboard.`);
    } catch {
      setStatusMessage("Copy was blocked by the browser. CSV export is still available.");
    }
  }

  function handleExportUserStories() {
    const csv = formatUserStoriesForCsv(userStories);
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-workflow-discovery-user-stories.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("User stories exported as a Jira-friendly CSV.");
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
          <button className="ghost-button" type="button" onClick={handleSaveAnalysis}>
            <Icon name={analysisSaveState.isSaved ? "bookmarkFilled" : "bookmark"} />
            Save analysis
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
              <h2>Paste or type your business process notes</h2>
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

          <section className="saved-panel" aria-label="Saved analyses">
            <div className="saved-panel-header">
              <div>
                <h2>Saved analyses</h2>
                <p>{savedAnalyses.length} of {maxSavedAnalyses} saved locally</p>
              </div>
            </div>
            {savedAnalyses.length ? (
              <ul className="saved-list">
                {savedAnalyses.map((savedAnalysis) => (
                  <li key={savedAnalysis.id} className="saved-item">
                    <button
                      className="saved-restore-button"
                      type="button"
                      onClick={() => handleRestoreSavedAnalysis(savedAnalysis)}
                    >
                      <span>{getSavedAnalysisTitle(savedAnalysis.notes)}</span>
                      <small>{formatSavedDate(savedAnalysis.createdAt)}</small>
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      aria-label={`Delete ${getSavedAnalysisTitle(savedAnalysis.notes)}`}
                      onClick={() => handleDeleteSavedAnalysis(savedAnalysis.id)}
                    >
                      <Icon name="trash" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="saved-empty">Saved analyses will appear here after you save a brief.</p>
            )}
          </section>
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
          <UserStoriesSection
            stories={userStories}
            isExpanded={areUserStoriesExpanded}
            onToggle={() => setAreUserStoriesExpanded((isExpanded) => !isExpanded)}
            onCopyStory={handleCopyStory}
            onExport={handleExportUserStories}
          />
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

function formatUserStoriesForCsv(userStories) {
  const rows = [
    ["Issue Type", "Summary", "Description", "Story ID"],
    ...userStories.map((story) => ["Story", story.title, story.storyText, story.id])
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function queuePageTopScroll() {
  if (typeof window === "undefined") {
    return;
  }

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function loadSavedAnalyses() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedAnalyses = window.localStorage.getItem(savedAnalysesStorageKey);

    if (!storedAnalyses) {
      return [];
    }

    const parsedAnalyses = JSON.parse(storedAnalyses);

    if (!Array.isArray(parsedAnalyses)) {
      return [];
    }

    return parsedAnalyses.filter(isSavedAnalysis).slice(0, maxSavedAnalyses);
  } catch {
    return [];
  }
}

function persistSavedAnalyses(savedAnalyses) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(savedAnalysesStorageKey, JSON.stringify(savedAnalyses));
    return true;
  } catch {
    return false;
  }
}

function createSavedAnalysis(notes, analysis, userStories) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    notes,
    analysis,
    userStories
  };
}

function createAnalysisKey(notes, analysis, userStories) {
  return JSON.stringify({ notes, analysis, userStories });
}

function createSavedAnalysisKey(savedAnalysis) {
  return createAnalysisKey(savedAnalysis.notes, savedAnalysis.analysis, savedAnalysis.userStories ?? []);
}

function getAnalysisSaveState(currentAnalysisKey, savedAnalysisId, savedAnalyses) {
  const savedAnalysis = savedAnalyses.find((item) => item.id === savedAnalysisId);
  const exactSavedAnalysis = savedAnalyses.find((item) => createSavedAnalysisKey(item) === currentAnalysisKey);

  if (savedAnalysis && createSavedAnalysisKey(savedAnalysis) !== currentAnalysisKey) {
    return {
      status: "unsaved",
      label: "Unsaved",
      savedAnalysis,
      isSaved: false
    };
  }

  if (savedAnalysis || exactSavedAnalysis) {
    return {
      status: "saved",
      label: "Saved",
      savedAnalysis: savedAnalysis ?? exactSavedAnalysis,
      isSaved: true
    };
  }

  return {
    status: "unsaved",
    label: "Unsaved",
    savedAnalysis: null,
    isSaved: false
  };
}

function isSavedAnalysis(savedAnalysis) {
  return Boolean(
    savedAnalysis &&
      typeof savedAnalysis.id === "string" &&
      typeof savedAnalysis.createdAt === "string" &&
      typeof savedAnalysis.notes === "string" &&
      savedAnalysis.analysis &&
      typeof savedAnalysis.analysis === "object" &&
      sectionMeta.every((section) => Array.isArray(savedAnalysis.analysis[section.key])) &&
      (savedAnalysis.userStories === undefined || isUserStoryList(savedAnalysis.userStories))
  );
}

function isUserStoryList(userStories) {
  return (
    Array.isArray(userStories) &&
    userStories.every((story) =>
      story &&
      typeof story.id === "string" &&
      typeof story.title === "string" &&
      typeof story.storyText === "string"
    )
  );
}

function getSavedAnalysisTitle(notes) {
  const firstLine = notes.trim().split("\n").find(Boolean);

  if (!firstLine) {
    return "Untitled analysis";
  }

  return firstLine.length > 54 ? `${firstLine.slice(0, 51)}...` : firstLine;
}

function formatSavedDate(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
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

function UserStoriesSection({ stories, isExpanded, onToggle, onCopyStory, onExport }) {
  return (
    <section className="user-stories-section" aria-label="Generated user stories">
      <button className="story-toggle-button" type="button" onClick={onToggle}>
        <span>{isExpanded ? "−" : "+"}</span>
        {isExpanded ? "Hide User Stories" : "View generated User Stories"}
      </button>

      {isExpanded ? (
        <div className="story-panel">
          <div className="story-panel-header">
            <div>
              <span className="results-kicker">Generated user stories</span>
              <h3>Jira-ready story draft</h3>
            </div>
            <button className="outline-button strong" type="button" onClick={onExport} disabled={!stories.length}>
              <Icon name="download" />
              Export CSV
            </button>
          </div>

          {stories.length ? (
            <div className="story-list">
              {stories.map((story) => (
                <article className="story-card" key={story.id}>
                  <div className="story-card-header">
                    <div>
                      <span className="story-id">{story.id}</span>
                      <h4>{story.title}</h4>
                    </div>
                    <button className="outline-button" type="button" onClick={() => onCopyStory(story)}>
                      <Icon name="copy" />
                      Copy story
                    </button>
                  </div>
                  <p>{story.storyText}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="stories-empty">User stories will appear after workflow analysis is generated.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

function Icon({ name }) {
  const icons = {
    alert: <path d="M12 3 2 20h20L12 3Zm0 6v5m0 3h.01" />,
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    bookmarkFilled: <path d="M6 4h12v17l-6-4-6 4V4Z" fill="currentColor" />,
    chart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-7" />,
    check: <path d="M20 6 9 17l-5-5" />,
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
    trash: <path d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />,
    user: <path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}

export default App;
