# AI Workflow Discovery Assistant

A React + Vite portfolio project for AI Operator roles. The application helps teams turn messy business process notes into a structured AI workflow discovery brief, then extends the analysis into implementation impact so teams can move from ideas to adoption.

## Business Problem

Many teams understand that AI could improve their operations, but their workflows are often documented in scattered notes, email threads, spreadsheets, and tribal knowledge. This makes it difficult to identify what should be automated, what still needs human judgment, and how to measure whether an AI-powered process is actually improving the business.

The result is a common gap between AI enthusiasm and practical implementation:

- Current-state workflows are unclear.
- Bottlenecks and manual handoffs are hard to quantify.
- Requirements are mixed with informal notes.
- AI opportunities are not separated from human review needs.
- Teams lack adoption plans, test scenarios, and success metrics.

## AI Solution

AI Workflow Discovery Assistant acts like a lightweight discovery workspace for AI Operators, automation consultants, and transformation teams. A user pastes business process notes into the app, clicks **Analyze Workflow**, and receives a structured workflow brief covering both process design and AI adoption.

The app currently uses explainable local demo logic so it can run without API keys. It is designed so a real LLM integration can later replace the local analysis helper while keeping the same interface and output structure.

## How The Workflow Works

1. A user enters unstructured business notes, including process steps, teams, tools, pain points, and goals.
2. The app analyzes the notes and detects useful signals such as actors, systems, compliance language, and process risks.
3. The output is organized into reusable sections:
   - Current workflow
   - Bottlenecks
   - Requirements
   - User stories
   - Acceptance criteria
   - AI automation opportunities
   - Human review points
   - Test scenarios
   - Implementation Impact
4. The user can copy the result, export the analysis, save it in the session, restore recent history, or start a new analysis.
5. The implementation impact section helps translate workflow analysis into an adoption plan with estimated time saved, manual steps reduced, recommended rollout approach, and success metrics.

## Where AI Acts Autonomously

In a production version, AI could act autonomously in bounded, auditable areas such as:

- Extracting structured data from unstructured notes, emails, forms, and attachments.
- Classifying workflow steps, owners, systems, and handoffs.
- Identifying repeated manual work and automation candidates.
- Drafting requirements, user stories, acceptance criteria, and test scenarios.
- Suggesting adoption metrics and rollout plans.
- Producing summaries that can be copied into project documentation or discovery decks.

These autonomous actions are best suited for low-risk analysis, drafting, classification, and recommendation tasks where the output can be reviewed before implementation.

## Where Human Review Is Required

Human review remains essential for decisions that involve judgment, risk, policy, or organizational change. The app explicitly identifies human review points so automation does not remove necessary oversight.

Human review should be required for:

- High-value or policy-sensitive workflows.
- Exceptions, overrides, and ambiguous cases.
- Compliance, audit, privacy, legal, or financial decisions.
- Customer or employee communications requiring empathy.
- Final approval before changing systems of record.
- Validation of success metrics and adoption readiness.

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- Local browser APIs for copy and export actions
- Playwright for rendered UI validation during development

## Project Structure

```text
.
├── index.html
├── package.json
├── package-lock.json
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── workflowAnalyzer.js
└── README.md
```

## Getting Started

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

## GitHub Publishing Checklist

Before publishing to GitHub:

1. Confirm the app builds with `npm run build`.
2. Review the README for portfolio positioning.
3. Create a remote GitHub repository.
4. Add the remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-workflow-discovery-assistant.git
```

5. Push the main branch:

```bash
git push -u origin main
```

## Future Improvements

- Replace local demo analysis with an LLM-backed workflow analysis pipeline.
- Add configurable industry templates for operations, finance, HR, sales, support, and compliance workflows.
- Add confidence scoring for AI-generated recommendations.
- Add editable output sections so operators can refine the generated brief.
- Add persistent saved analyses using local storage or a backend database.
- Add export formats for Markdown, PDF, and project-management tickets.
- Add authentication and team workspaces.
- Add integration targets such as Slack, Gmail, Google Drive, Jira, ServiceNow, Salesforce, and NetSuite.
- Add measurement dashboards for cycle time, automation rate, exception rate, and human-review load.

## Portfolio Positioning

This project demonstrates the kind of work expected from an AI Operator: translating messy business processes into structured AI-enabled workflows, identifying where automation is useful, preserving human oversight, and defining practical adoption metrics.
