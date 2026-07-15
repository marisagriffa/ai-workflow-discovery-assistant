# AI Workflow Discovery Assistant

AI Workflow Discovery Assistant turns informal business process notes into a structured workflow discovery brief, helping teams identify bottlenecks, requirements, AI automation opportunities, human review points, implementation impact, and Jira-friendly User Stories.

This project demonstrates workflow discovery, requirements analysis, AI adoption planning, and responsible human-in-the-loop design.

## Business Problem

Operational processes are often described across emails, spreadsheets, tickets, chat threads, and informal stakeholder notes. Before a team can improve or automate a workflow, it needs a clear view of:

- how the process works today;
- where handoffs, missing information, and delays appear;
- what requirements an improved workflow must satisfy;
- where AI or automation could help;
- where human judgment and review must remain in control.

This project addresses the early discovery gap between messy process notes and structured, actionable product and operations outputs.

## Target Users

- Operations and AI Operations teams reviewing manual workflows.
- Product Owners shaping workflow automation opportunities.
- Business Analysts and Functional Analysts preparing discovery outputs.
- Process Improvement Analysts identifying bottlenecks and implementation impact.
- Support, service, or back-office teams documenting repeatable workflows.

## Product Workflow

1. Paste or type business process notes.
2. Generate a structured workflow analysis.
3. Review the current workflow, bottlenecks, requirements, AI opportunities, human review points, and implementation impact.
4. Expand the generated User Stories section when needed.
5. Copy individual outputs or export analysis and User Stories.
6. Save the analysis locally and restore it from Saved analyses.

## Current Implemented Capabilities

- Deterministic local workflow analysis from free-form business notes.
- English interface with generated content in English or Spanish, based on the input notes.
- Six analysis sections:
  - Current workflow
  - Bottlenecks
  - Requirements
  - AI automation opportunities
  - Human review points
  - Implementation Impact
- Automatically generated User Stories linked to the analysis.
- Inline collapsible User Stories section after Implementation Impact.
- Individual User Story copy action.
- Jira-friendly CSV export for all generated User Stories.
- Plain text export for the workflow analysis.
- Local saved analyses with duplicate-save prevention.
- Bookmark-based saved-state indicator.

## Skills Demonstrated

- Workflow discovery and process mapping.
- Requirements analysis and functional decomposition.
- AI adoption opportunity assessment.
- Human-in-the-loop operating model design.
- User Story generation for delivery planning.
- Product scope control and MVP trade-off decisions.
- Professional documentation and stakeholder communication.
- Lightweight frontend implementation to validate a product workflow.


## Example Input

```text
The support team receives customer requests by email and copies details into a spreadsheet.
Some requests are missing account information, so agents reply manually to ask for clarification.
Managers review urgent cases in a daily meeting, but status updates are not always reflected in the tracker.
The team wants faster triage, fewer missed handoffs, and clearer ownership before escalation.
```

## Example Output

The tool produces a structured discovery brief such as:

- Current workflow: request intake, manual data capture, clarification, manager review, escalation.
- Bottlenecks: missing information, spreadsheet duplication, delayed status updates, unclear ownership.
- Requirements: capture required fields, assign owners, flag urgent cases, maintain a shared status view.
- AI automation opportunities: classify request type, identify missing fields, draft clarification messages, summarize urgent cases.
- Human review points: escalation decisions, sensitive customer communications, exceptions, and policy-sensitive cases.
- Implementation Impact: reduced triage time, clearer handoffs, better visibility, and more consistent escalation handling.

Generated User Stories use the format:

```text
US-001 - Capture required request information
As a support agent, I want required customer details to be identified during intake, so that incomplete requests can be resolved before escalation.
```

Spanish notes generate Spanish analysis and Spanish User Stories.

## Responsible AI And Human Review

The project separates AI assistance from accountable human decisions. It treats AI as a support layer for structuring information, identifying gaps, drafting summaries, and suggesting workflow improvements.

Human review remains necessary for:

- high-risk or policy-sensitive decisions;
- incomplete, contradictory, or ambiguous information;
- customer-facing communication requiring judgment or empathy;
- exceptions, overrides, approvals, and irreversible system updates.

The current analyzer is deterministic local logic used to validate the workflow and product experience. It does not call a real AI API, backend service, or external model.

## Architecture And Technology

The project is intentionally lightweight so the workflow can be evaluated without credentials or infrastructure.

- React for the user interface.
- Vite for local development and production builds.
- JavaScript for deterministic analysis logic.
- CSS for responsive interface styling.
- Browser local storage for saved analyses.
- Browser Clipboard and download APIs for copy and export actions.

Core files:

```text
src/
  App.jsx              UI, state, save/restore behavior, copy/export behavior, rendering
  workflowAnalyzer.js  Local deterministic analysis and User Story generation logic
  styles.css           Responsive interface styling
  main.jsx             React entry point
```

## Intentional MVP Limitations

- No real AI API integration.
- No backend database.
- No authentication, user accounts, or team workspace.
- No external system integrations.
- No acceptance criteria generation yet.
- No test scenario generation yet.
- Saved analyses are browser-local only.
- Analysis export is plain text.
- User Stories export is CSV.

These limitations are intentional for the MVP: the goal is to validate the product workflow, analysis structure, and human-review model before adding external services.

## Roadmap

### Implemented

- Workflow analysis from business notes.
- AI opportunity and human review sections.
- Automatic User Story generation.
- Jira-friendly User Story CSV export.
- Local saved analyses.
- English and Spanish generated content behavior.
- Deployment-ready Vite build.

### Next

- Editable analysis sections before export.
- More robust language and process-pattern detection.
- Improved templates for operations, support, HR, finance, and compliance workflows.
- Stronger demo examples and screenshots.

### Later

- Real LLM-backed analysis with traceability and confidence indicators.
- Backend persistence and team workspaces.
- Authentication and role-based access.
- Integrations with tools such as Jira, Slack, Gmail, Google Drive, Notion, ServiceNow, Salesforce, or NetSuite.
- Additional export formats such as Markdown, DOCX, or PDF.
- Acceptance criteria and test scenario generation after the core workflow is validated.

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

Vercel configuration:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: none required

## Live Demo And Screenshots

Live demo: https://ai-workflow-discovery-assistant.vercel.app/

Screenshots:

- `docs/screenshots/Overview.png`
- `docs/screenshots/UserStories.png`
