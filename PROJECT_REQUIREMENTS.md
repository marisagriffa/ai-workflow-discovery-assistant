# PROJECT REQUIREMENTS

## Document Purpose and Maintenance

This document describes the current product scope, implemented behavior, limitations, requirements, technical context, product decisions, and open questions for the AI Workflow Discovery Assistant.

This is living documentation.

The implementation in the repository is the primary source of truth. This document must be reviewed and updated whenever a change affects:

- implemented functionality;
- mocked, planned, or deferred functionality;
- functional or non-functional requirements;
- product scope;
- AI behavior;
- architecture or technical context;
- current limitations;
- technical debt;
- roadmap status;
- product decisions;
- open questions.

This document must clearly distinguish between:

- implemented;
- mocked or limited;
- planned;
- deferred.

It must never describe planned or mocked behavior as fully implemented.

## 1. Product Overview

- **Product name:** AI Workflow Discovery Assistant
- **Purpose:** Help teams transform messy business process notes into structured AI-powered workflow briefs and adoption guidance.
- **Target users:** Operations teams, product teams, support teams, AI Operators, automation consultants, and managers evaluating AI-enabled process improvement.
- **Business problem:** Teams often document processes in scattered notes, emails, spreadsheets, and tribal knowledge. This makes bottlenecks, automation candidates, human review needs, and adoption metrics difficult to identify consistently.
- **Expected value:** Faster workflow discovery, clearer process documentation, more consistent evaluation, explicit human-in-the-loop boundaries, and better adoption planning for AI-powered workflows.

## 2. Current Product Scope

### Existing Features

- React + Vite single-page application.
- Business notes textarea with character and word count.
- `Analyze Workflow` button using local demo analysis logic.
- Structured output sections:
  - Current workflow
  - Bottlenecks
  - Requirements
  - AI automation opportunities
  - Human review points
  - Implementation Impact
- Top navigation actions: Save analysis and New analysis.
- Persistent saved analyses stored in browser local storage with duplicate prevention and a compact restore/delete list.
- Result actions: Copy result, Export analysis, and Regenerate.
- User stories are generated automatically with each workflow analysis and are available in a collapsible section after Implementation Impact.
- Collapsible user stories section with individual story copy and Jira-friendly CSV export for all generated stories.
- English application interface with generated analysis and user story content matching the detected language of the business notes.
- Responsive SaaS-style UI with icons.
- GitHub repository published at `https://github.com/marisagriffa/ai-workflow-discovery-assistant`.

### Current User Flow

1. User opens the app.
2. Sample notes are preloaded and sample analysis is shown.
3. User edits or replaces business notes.
4. User clicks `Analyze Workflow` or `Regenerate`.
5. App creates a structured analysis and generated user stories using local deterministic helper logic.
6. User may expand the generated user stories section, copy individual stories, export all stories as a Jira-friendly CSV, and collapse the section.
7. User may save the analysis and generated user stories to browser local storage, restore or delete saved analyses, copy output text, export a text file, or start a new analysis.

### Current Limitations

- No real LLM/API integration.
- No backend.
- No backend database.
- No authentication or team workspace.
- No permanent automated test suite.
- Primary analysis export format is plain text only.
- Generated user stories export as a single CSV only.

### Removed Or Superseded

- The History action was removed from the current interface.
- The separate Generate User Stories button was superseded by automatic User Story generation whenever analysis is generated or regenerated.
- The separate User Stories view was superseded by an inline collapsible User Stories section after Implementation Impact.
- Separate User Story saved-state management was superseded by saving User Stories as part of the saved analysis record.

### Deferred

- Acceptance criteria generation is deferred.
- Test scenario generation is deferred.
- Real LLM/API integration is deferred.
- Backend persistence, authentication, team workspaces, and third-party integrations are deferred.

### Mocked Or Not Functional

- "AI analysis" is mocked by local rule-based logic in `src/workflowAnalyzer.js`.
- Saved analyses, including their generated user stories, persist only in the current browser through local storage; they do not sync across devices or users.
- Copy depends on browser clipboard permissions.
- Integrations with Slack, Jira, Notion, Gmail, Drive, ServiceNow, Salesforce, and NetSuite are planned only.

## 3. Functional Requirements

### FR-001 Workflow Input

- **Description:** The app shall provide a textarea for unstructured business process notes.
- **Priority:** High
- **Acceptance criteria:** User can type, paste, edit, and clear notes; character and word counts update from trimmed input.

### FR-002 AI Analysis

- **Description:** The app shall generate a structured workflow brief from the provided notes.
- **Priority:** High
- **Acceptance criteria:** Clicking `Analyze Workflow` updates all output sections; empty input displays empty-state guidance; current implementation may use local demo logic.

### FR-003 Current Workflow Output

- **Description:** The app shall summarize how work currently moves from intake to completion.
- **Priority:** High
- **Acceptance criteria:** Output includes actor/requester context, tools when detected, review/approval flow, and closure/system-of-record step.

### FR-004 Bottlenecks

- **Description:** The app shall identify likely process delays and friction points.
- **Priority:** High
- **Acceptance criteria:** Output references manual handoffs, missing information, status tracking gaps, and policy/decision-rule friction when applicable.

### FR-005 Requirements

- **Description:** The app shall infer workflow requirements from notes.
- **Priority:** High
- **Acceptance criteria:** Output includes structured intake, visibility, routing rules, audit trail, and integration needs.

### FR-006 User Stories

- **Description:** The app shall generate structured user stories from the current workflow analysis using local deterministic logic.
- **Priority:** Medium
- **Acceptance criteria:** User stories are generated automatically whenever analysis is generated or regenerated; generated stories appear in a collapsible section after Implementation Impact; closed state reads `+ View generated User Stories`; open state reads `- Hide User Stories`; each story includes an ID such as `US-001`, a short title, and complete story text in the same detected language as the business notes; Spanish stories use `Como [rol], quiero [funcionalidad], para [valor].`; English stories use an equivalent English user-story format; acceptance criteria are not generated; user stories are saved as part of the associated analysis.

### FR-007 Acceptance Criteria

- **Description:** Acceptance criteria generation is deferred from the primary analysis results.
- **Priority:** High
- **Acceptance criteria:** Acceptance criteria are not part of the primary analysis results, export, or saved-analysis validation.

### FR-008 AI Automation Opportunities

- **Description:** The app shall map where AI can reduce manual work.
- **Priority:** High
- **Acceptance criteria:** Output includes extraction, classification, drafting, validation, and status synchronization opportunities.

### FR-009 Human Review Points

- **Description:** The app shall identify where human judgment remains required.
- **Priority:** High
- **Acceptance criteria:** Output includes high-value/high-risk cases, low-confidence or contradictory information, empathetic communications, and irreversible updates.

### FR-010 Test Scenarios

- **Description:** Test scenario generation is deferred from the primary analysis results.
- **Priority:** Medium
- **Acceptance criteria:** Test scenarios are not part of the primary analysis results, export, or saved-analysis validation.

### FR-011 Implementation Impact

- **Description:** The app shall connect workflow analysis to adoption planning.
- **Priority:** High
- **Acceptance criteria:** Output includes estimated time saved, manual steps reduced, recommended adoption approach, and success metrics.

### FR-012 History

- **Description:** Analysis history is not part of the current interface.
- **Priority:** Medium
- **Acceptance criteria:** The app does not show a History action.

### FR-013 Saved Analyses

- **Description:** The app shall provide a Saved analyses action.
- **Priority:** Medium
- **Acceptance criteria:** Current implementation stores saved analyses and their generated user stories in browser local storage, silently prevents duplicate saves for unchanged notes, analysis, and user stories, caps at 8, displays a compact saved list, restores saved notes, analysis output, and generated user stories, supports delete, and uses the Save analysis bookmark icon as the saved-state indicator.

### FR-014 New Analysis

- **Description:** The app shall allow users to start a fresh analysis.
- **Priority:** High
- **Acceptance criteria:** Clicking `New analysis` clears notes, resets output to empty-state guidance, and changes heading to "Ready for analysis".

### FR-015 Copy

- **Description:** The app shall copy the structured analysis to the clipboard.
- **Priority:** Medium
- **Acceptance criteria:** Clicking `Copy result` writes formatted section text to clipboard when permitted and shows success or fallback status.

### FR-016 Export

- **Description:** The app shall export the analysis as a downloadable file.
- **Priority:** Medium
- **Acceptance criteria:** Clicking `Export analysis` downloads `ai-workflow-discovery-analysis.txt` containing all primary result sections in text format.

### FR-017 User Story CSV Export

- **Description:** The app shall export all generated user stories as one Jira-friendly CSV file.
- **Priority:** Medium
- **Acceptance criteria:** CSV export is available from the expanded inline User Stories section; the CSV includes `Issue Type`, `Summary`, `Description`, and `Story ID`; every row uses `Story` as the Issue Type; individual per-story CSV export is not provided.

## 4. Non-Functional Requirements

- **Usability:** Interface must feel like a real internal SaaS workflow tool, not a simple demo page.
- **Performance:** Analysis should update instantly with local logic; future API calls should show loading/error states.
- **Security:** Do not commit API keys, tokens, `.env` files, `node_modules/`, or generated build artifacts.
- **Maintainability:** Keep architecture simple; UI in `App.jsx`, analysis rules in `workflowAnalyzer.js`, styles in `styles.css`.
- **Accessibility:** Use semantic controls, labels, aria-live result/status areas, and keyboard-accessible buttons.
- **Responsive design:** Layout must work on desktop and mobile without clipped controls or overlapping text.
- **Data privacy:** Current app runs local demo logic and sends no notes to external services.
- **Reliability:** Build must pass with `npm run build`; copy/export should fail gracefully when browser permissions block them.
- **Language behavior:** The application interface remains English; generated analysis and user stories match the detected language of the business notes.

## 5. AI Behavior

- **Expected AI input:** Unstructured process notes containing steps, teams, tools, pain points, goals, approvals, compliance language, and target outcomes.
- **Expected structured output:** The six primary workflow analysis sections listed in Current Product Scope, plus automatically generated user stories as a secondary artifact.
- **Language behavior:** Generated content uses local language detection; Spanish notes generate Spanish analysis and user stories, while English notes generate English analysis and user stories.
- **Human-in-the-loop rules:** AI may draft and classify, but humans validate, approve, and own final decisions.
- **Where AI may act autonomously:** Extract fields, classify workflow type/urgency/owner, draft summaries, propose user stories, identify bottlenecks, and recommend automation candidates.
- **Where human review is required:** High-risk, high-value, policy-sensitive, ambiguous, low-confidence, contradictory, or empathy-heavy cases.
- **Where final human ownership is mandatory:** Policy exceptions, irreversible system-of-record updates, compliance/legal/financial decisions, rollout approval, and success metric acceptance.
- **Error and fallback behavior:** Empty input returns guidance; copy failures show fallback status; future LLM failures should preserve user input and show a retryable error.
- **Output validation expectations:** Output must include all required primary sections, avoid claiming implemented integrations that do not exist, separate automation from human review, and keep generated user stories separate from acceptance criteria.

## 6. Technical Context

- **Current stack:** React, Vite, JavaScript, CSS, npm.
- **Current architecture:** Single-page React app; `App.jsx` manages UI and local state; `workflowAnalyzer.js` provides deterministic mock analysis; `styles.css` owns visual design.
- **External services:** None in the app. GitHub is used for repository hosting.
- **Environment variables:** None required. Future provider keys must live in environment variables and never be committed.
- **Testing tools:** No permanent test framework. Development validation has used `npm run build` and temporary Playwright checks.
- **Known technical debt:** No real AI integration, no backend database, no formal tests, no lint/format tooling, no routing, no PDF export, and no export formats beyond primary-analysis text and user-story CSV.

## 7. Git and Delivery Workflow

- `main` is the stable branch.
- `dev` is the integration branch.
- Feature branches and fix branches must be created from `dev`.
- Pull requests from feature/fix branches merge into `dev`.
- Pull requests from `dev` into `main` happen only when explicitly approved by Marisa Griffa.
- Do not push directly to `main` unless the owner explicitly requests it.

## 8. Agent Working Rules

- Follow `AGENTS.md` for repository conventions.
- Keep source organization simple:
  - UI/state in `src/App.jsx`
  - analysis logic in `src/workflowAnalyzer.js`
  - styling in `src/styles.css`
- Use modern React functional components and hooks.
- Prefer plain CSS classes over inline styles.
- Match existing 2-space indentation and naming conventions.
- Validate changes with `npm run build`.
- For UI changes, manually verify notes input, Analyze Workflow, all output sections, copy, export, saved analyses, user stories, and new analysis if touched.
- Do not commit secrets, `.env` files, generated builds, dependency folders, or temporary test artifacts.
- Keep commit messages short, specific, and action-oriented.
- PRs should include summary, screenshots for visual changes, validation commands, and dependency/config notes.

## 9. Product Decisions

- **AI workflow transformation positioning:** The product is positioned as a practical AI workflow transformation tool because the goal is adoption-ready process improvement, not only text summarization.
- **Explicit human review points:** Human review points are required to make AI adoption safer, auditable, and accountable.
- **Required product actions:** Saved analyses, New analysis, Copy, Export, Regenerate, and collapsible generated User Stories are required because they make the app feel like a usable internal workflow tool and support stakeholder documentation.
- **Automatic User Story generation:** User Stories are generated with the workflow analysis so users do not need a separate generation step.
- **Inline secondary artifact:** User Stories are shown in a collapsible section instead of replacing the main analysis, keeping the workflow brief visible while still supporting Jira-ready story export.
- **Deferred acceptance criteria and test scenarios:** These outputs are intentionally deferred to keep the current product focused on discovery, requirements, automation candidates, human review, implementation impact, and User Stories.
- **Professional SaaS look:** The UI must resemble a real internal SaaS product suitable for AI Operator work, not a minimal demo or landing page.
- **Rejected/deferred ideas:** Marketing-style landing page, purely decorative controls, real LLM integration without credential planning, backend storage, team collaboration, and third-party workflow integrations were deferred.

## 10. Roadmap

### Completed

- React + Vite app scaffold.
- Professional SaaS UI.
- Local demo workflow analyzer.
- Six primary output sections.
- Top navigation and result actions.
- Copy/export functionality.
- GitHub repository publication.
- README and AGENTS contributor guide.
- `dev` branch and PR-based workflow setup.
- Persistent saved analyses with restore and delete actions.
- Enabled deterministic user story generation with collapsible inline access, copy, saved-analysis persistence, restore support, and Jira-friendly CSV export.
- English interface with generated content localized to English or Spanish notes.
- Removed History from the application interface.

### In Progress

- Portfolio documentation and screenshot presentation.

### Planned

- Real LLM-backed analysis.
- Editable output sections.
- Markdown/PDF export.
- Formal automated tests.

### Deferred

- Slack/Jira/Notion/Gmail/Drive/ServiceNow/Salesforce/NetSuite integrations.
- Authentication and team workspaces.
- Dashboards for cycle time, automation rate, exception rate, and human-review load.
- Backend database.

### Recommended Next Task

Add editable output sections so users can refine generated briefs before copy or export.

## 11. Open Questions

- Which LLM provider and model should power production analysis?
- Which export format should be prioritized after plain text: Markdown, PDF, DOCX, or project-management tickets?
- What industries or workflow templates should be supported first?
- What success metrics should be customizable by the user?
- Which third-party integration should be implemented first?
- Should authentication be added before persistence or collaboration features?

## 12. Documentation Maintenance Rules

Before completing a feature, fix, refactor, or documentation task, the agent must determine whether the change makes any part of this document outdated.

If the change affects product behavior, scope, requirements, AI behavior, architecture, limitations, technical debt, roadmap status, product decisions, or open questions, this file must be updated in the same branch and pull request.

The document must not be updated mechanically when the change does not affect its content.

Before committing, the agent must report one of the following:

- `PROJECT_REQUIREMENTS.md updated: [brief reason]`
- `No PROJECT_REQUIREMENTS.md update required: [brief reason]`

A feature must not be marked as completed only because code was written. It may be considered completed only after:

- implementation is finished;
- relevant validation succeeds;
- affected documentation is updated;
- the change is accepted according to the repository workflow.
