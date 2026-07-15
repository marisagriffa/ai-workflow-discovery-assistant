# AI Workflow Discovery Assistant

AI Workflow Discovery Assistant is a React + Vite portfolio project for AI Operations, Product, Business Analysis, and Process Improvement roles. It helps teams turn messy business process notes into a structured workflow discovery brief with bottlenecks, requirements, automation opportunities, human review points, implementation impact, and generated user stories.

The current implementation is a local deterministic prototype. It does not call an LLM, backend, or external service. This keeps the project explainable and safe while demonstrating the product workflow and analysis logic.

## Product Value

Business workflows are often documented in scattered notes, emails, spreadsheets, chat threads, and informal team knowledge. Before a team can improve or automate a process, it needs a clear view of:

- how the current workflow moves from intake to completion;
- where manual handoffs, missing information, and status gaps slow the process down;
- what requirements an improved workflow must satisfy;
- where AI can safely assist;
- where human review remains required;
- how implementation impact should be measured.

This tool gives teams a structured starting point for workflow discovery and AI adoption planning.

## Target Users

- Operations teams mapping internal workflows and handoffs.
- Product teams defining AI-assisted workflow requirements.
- Business Analysts and Functional Analysts preparing structured discovery artifacts.
- Process Improvement Analysts identifying bottlenecks and automation candidates.
- Support teams improving triage, escalation, and response workflows.
- AI Operators or automation consultants preparing stakeholder-ready workflow briefs.

## Current Workflow

1. The user enters or edits business process notes.
2. The user clicks `Analyze Workflow` or `Regenerate`.
3. The app generates a structured workflow brief using local deterministic logic.
4. The app automatically generates User Stories from the same analysis.
5. The user can copy or export the primary analysis as a text file.
6. The user can expand `+ View generated User Stories` after Implementation Impact.
7. The user can copy individual User Stories or export all stories as a Jira-friendly CSV.
8. The user can save the analysis, including its generated User Stories, in browser local storage.
9. Saved analyses can be restored or deleted from the Saved analyses panel.

## Implemented Output

The primary workflow brief includes six sections:

- Current workflow
- Bottlenecks
- Requirements
- AI automation opportunities
- Human review points
- Implementation Impact

Generated User Stories are implemented as a secondary artifact. They appear in an inline collapsible section after Implementation Impact and include:

- Story ID, such as `US-001`
- Short title
- Complete story text
- Copy action for each story
- CSV export for all generated stories

The CSV includes:

- `Issue Type`
- `Summary`
- `Description`
- `Story ID`

Every exported row uses `Story` as the Issue Type.

## Deferred Outputs

Acceptance criteria and test scenarios are intentionally deferred. They are not part of the current primary analysis, saved-analysis validation, copy output, or export output.

## Language Behavior

The application interface is in English.

Generated content follows the detected language of the business process notes:

- English notes generate English analysis and English User Stories.
- Spanish notes generate Spanish analysis and Spanish User Stories.

Language detection is deterministic and currently limited to English and Spanish heuristics.

## Saved Analysis Behavior

Saved analyses are stored in browser local storage. A saved analysis includes:

- notes;
- generated analysis output;
- generated User Stories.

Duplicate saves are silently prevented when notes, analysis output, and User Stories have not changed. The `Save analysis` bookmark icon is the saved-state indicator:

- outlined bookmark: current analysis is not saved;
- filled bookmark: current analysis is already saved.

Saved analyses are local to the browser and do not sync across users or devices.

## Responsible AI And Human Review

The product separates automation opportunities from human review points. This is central to the intended AI adoption workflow.

AI may assist with:

- extracting structured fields from notes, forms, emails, and documents;
- classifying requests by type, urgency, owner, and missing information;
- drafting summaries, replies, approval notes, recommendations, and user stories;
- validating requests against rules, policies, and historical patterns;
- syncing status updates across collaboration and system-of-record tools.

Human review remains required for:

- high-value, high-risk, or policy-sensitive requests;
- missing, contradictory, or low-confidence information;
- communications that require judgment or empathy;
- exceptions, overrides, and irreversible system updates.

The assistant supports human decision-making. It does not replace accountable process owners, reviewers, or operators.

## Screenshots

Current portfolio screenshots are stored in `docs/screenshots/`.

Recommended README order:

1. `docs/screenshots/Overview.png`
2. `docs/screenshots/UserStories.png`

## Technical Overview

### Technologies Used

- React
- Vite
- JavaScript
- CSS
- Browser local storage
- Browser Clipboard API
- Browser Blob and download APIs

### Architecture

```text
src/
  App.jsx              UI, local state, save/restore behavior, copy/export behavior, and result rendering
  workflowAnalyzer.js  Local deterministic analysis and User Story generation logic
  styles.css           Responsive SaaS-style styling
  main.jsx             React entry point
```

The analyzer can later be replaced with an LLM or workflow-analysis API without redesigning the interface.

## How To Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment Readiness

The app is ready for Vercel as a Vite project:

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required
- No backend or external service credentials required

## Current Limitations

- No real LLM/API integration.
- No backend database.
- No authentication or team workspace.
- No formal automated test suite.
- Saved analyses are browser-local only.
- Primary analysis export is plain text only.
- User Stories export is CSV only.
- Acceptance criteria and test scenarios are deferred.

## Future Improvements

- Add real LLM-backed workflow analysis with confidence scoring and source traceability.
- Add editable output sections so users can refine generated briefs before exporting.
- Add Markdown, PDF, or DOCX export.
- Add persistent history or team workspace storage.
- Add configurable workflow templates for operations, product, support, HR, finance, and compliance.
- Add integrations with tools such as Slack, Jira, Notion, Gmail, Google Drive, ServiceNow, Salesforce, and NetSuite.
- Add dashboards for cycle time, automation rate, exception rate, and human-review load.

## Portfolio Skills Demonstrated

- Workflow discovery
- Process improvement analysis
- Requirements definition
- User Story generation
- AI automation opportunity mapping
- Human-in-the-loop design
- Product scope and trade-off documentation
- Lightweight technical implementation with deployment-ready React/Vite
