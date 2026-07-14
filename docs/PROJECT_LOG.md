# Project Log

This file is a chronological record of meaningful project progress, decisions, validation, limitations, and recommended next steps.

## 2026-07-10 — Initial AI Operator portfolio project

### Goal
Create an AI Workflow Discovery Assistant as a practical AI Operator portfolio project.

### Work completed
- Created React + Vite application.
- Added structured workflow analysis sections.
- Added History, Saved analyses, New analysis, Copy, Export, and Regenerate actions.
- Published the repository on GitHub.
- Added README and AGENTS.md.
- Created PROJECT_REQUIREMENTS.md.

### Important decisions
- The current analysis remains a local deterministic prototype.
- Real AI integration will be added later.
- `main` is stable.
- `dev` is the integration branch.
- All changes must be developed in branches created from `dev`.
- Human review points must remain explicit.

### Known limitations
- No real LLM integration.
- No persistent history.
- No backend.
- No formal automated tests.

### Next step
Create and publish the `dev` branch.

## 2026-07-10 - Persistent saved analyses

### Goal
Make saved analyses durable and usable after a browser refresh.

### Work completed
- Added browser local storage persistence for saved analyses.
- Prevented duplicate saves for the same notes and analysis.
- Added a compact saved analyses list with restore and delete actions.
- Kept the saved analyses limit at 8.
- Updated PROJECT_REQUIREMENTS.md to reflect the implemented behavior.

### Validation
- `npm run build` passed.

## 2026-07-14 - User story language and saved-state refinement

### Goal
Keep the interface in English while making generated analysis and user stories match the language of the business notes.

### Work completed
- Added local English/Spanish language detection for deterministic analysis and user story generation.
- Fixed English notes producing Spanish user stories.
- Removed History from the interface.
- Separated analysis saved status from user-story generation and saved status.
- Added an explicit Save User Stories action so saving an analysis does not automatically save generated stories.
- Kept user stories linked to the analysis snapshot they were generated from.
- Updated the business notes panel heading.
- Updated PROJECT_REQUIREMENTS.md to reflect the refined behavior.

### Important decisions
- Application controls and labels remain English.
- Analysis status is limited to Unsaved or Saved.
- User Stories status is limited to Not generated, Generated, or Saved.
- User stories can be saved only after the related analysis has been saved.

### Known limitations
- Language detection is deterministic and supports English/Spanish heuristics only.
- Saved analyses and user stories remain browser-local only.

### Validation
- `npm run build` passed.
- Direct generator check confirmed English notes generate English analysis and user stories, and Spanish notes generate Spanish analysis and user stories.
- Temporary Playwright smoke test confirmed the heading change, removed History action, independent Analysis/User Stories statuses, Save User Stories behavior, and language-matched generated content.

## 2026-07-14 - Simplified generated user stories interface

### Goal
Remove the separate user stories workflow and make generated user stories part of the main analysis experience.

### Work completed
- Removed the saved-analysis counter from the Save analysis button.
- Generated user stories automatically whenever analysis is generated or regenerated.
- Replaced the separate user stories view with a collapsible section after Implementation Impact.
- Removed separate User Stories status, Back to analysis, and Save User Stories controls.
- Kept story cards and all-stories CSV export inside the expanded collapsible section.
- Saved generated user stories as part of the saved analysis record.
- Silently prevented duplicate saves for unchanged notes, analysis output, and generated user stories.
- Updated PROJECT_REQUIREMENTS.md to reflect the simplified behavior.

### Important decisions
- User stories are a secondary part of the saved analysis, not a separately managed saved artifact.
- The main analysis remains visible while user stories are accessed inline.

### Validation
- `npm run build` passed.
- Temporary Playwright smoke test confirmed the Save analysis button has no counter, User Stories are generated automatically, the inline collapsible section opens and closes with the requested labels, CSV export works, duplicate saves are silently ignored, saved analyses restore generated stories, and Spanish notes still generate Spanish analysis and stories.

## 2026-07-14 - Bookmark-only saved analysis indicator

### Goal
Simplify saved-analysis status by removing the right-panel saved/unsaved badge.

### Work completed
- Removed the Analysis saved/unsaved status badge from the results panel.
- Used the Save analysis bookmark icon as the only saved-state indicator.
- Switched the bookmark icon between outlined and filled states based on the current saved analysis snapshot.
- Kept duplicate-save prevention silent.
- Updated PROJECT_REQUIREMENTS.md to document the bookmark indicator behavior.

### Validation
- `npm run build` passed.
- Temporary Playwright smoke test confirmed the right-panel saved/unsaved badge is removed, the Save analysis bookmark changes from outlined to filled after save and restore, the icon returns to outlined after analysis changes, and duplicate saves remain silent.
- Browser validation confirmed save, reload persistence, restore, delete, and 8-analysis cap behavior.

## 2026-07-14 - Generate user stories

### Goal
Enable the existing Generate User Stories path without adding external AI, backend storage, authentication, or new dependencies.

### Work completed
- Added deterministic local user story generation from the current workflow analysis.
- Added a dedicated in-app user stories view.
- Added individual story copy and one Jira-friendly CSV export for all generated stories.
- Stored generated user stories with saved analyses.
- Added saved-state messaging for saved, unsaved, and saved-with-unsaved-changes states.
- Added an Update saved analysis path that modifies an existing saved analysis instead of creating a duplicate.
- Updated PROJECT_REQUIREMENTS.md to reflect the implemented behavior.

### Important decisions
- User stories remain a secondary artifact and do not appear in the primary workflow analysis export.
- Acceptance criteria remain deferred and are not generated with user stories.
- CSV export is all-stories-only; individual story CSV export is intentionally not implemented.

### Known limitations
- User story generation uses deterministic local logic, not a real LLM.
- Saved analyses and generated stories remain browser-local only.
- No PDF export, backend, authentication, or external Jira integration is included.

### Validation
- `npm run build` passed.
