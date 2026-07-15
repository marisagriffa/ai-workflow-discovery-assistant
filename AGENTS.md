# Repository Guidelines

## Project Structure & Module Organization

- `src/main.jsx` mounts the React app.
- `src/App.jsx` contains the UI, local state, navigation, copy/export behavior, and result rendering.
- `src/workflowAnalyzer.js` contains sample notes and explainable local analysis logic.
- `src/styles.css` contains all responsive SaaS-style styling.
- `index.html` is the Vite HTML entry point.
- `dist/` and `node_modules/` are generated locally and must not be committed.

There is no `assets/` or `tests/` directory yet. Add one only when needed.

## Build, Test, and Development Commands

- `npm install`: install project dependencies.
- `npm run dev`: start the Vite development server.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: preview the production build locally.

Use `npm.cmd` on Windows PowerShell if `npm` is blocked. Run `npm run build` before publishing or opening a pull request.

## Coding Style & Naming Conventions

Use modern React with functional components and hooks. Keep reusable analysis logic in `workflowAnalyzer.js`.

- Use 2-space indentation.
- Use `camelCase` for variables, functions, and object keys.
- Use `PascalCase` for React components.
- Keep components focused; avoid heavy abstractions.
- Prefer plain CSS classes in `styles.css` over inline styles.

No formatter or linter is configured, so match the existing style.

## Testing Guidelines

No permanent test framework is configured. For now, validate with:

```bash
npm run build
```

For UI changes, verify:

1. Enter or edit business notes.
2. Click `Analyze Workflow`.
3. Confirm all analysis sections render.
4. Confirm generated User Stories are available in the inline collapsible section.
5. Check copy, export, User Stories CSV export, saved analyses, and new analysis actions if changed.

If tests are added, place them near the feature or in `tests/` and document the command here.

## Commit & Pull Request Guidelines
### Branch workflow

After Marisa confirms that a pull request has been merged:

1. Switch to `dev`.
2. Fetch and pull the latest changes from `origin/dev`.
3. Verify that the working tree is clean.
4. Create a new branch from the updated `dev` branch for every new task.
5. Never start new work directly on `dev`.
6. Never create a new branch from an outdated feature branch.
7. Do not reuse a completed feature branch for unrelated work.

Before every commit, review whether PROJECT_REQUIREMENTS.md became outdated.

Update it in the same branch when the change affects product behavior, requirements, scope, limitations, architecture, AI behavior, roadmap status, decisions, or open questions.

Recent commits use concise, imperative messages:

- `Initial commit: AI workflow discovery assistant`
- `Improve AI Operator portfolio README`
- `Improve README product positioning`

Follow the same style: short, specific, and action-oriented.

Pull requests should include:

- A brief summary of user-facing changes.
- Screenshots for visual UI changes.
- Build/test commands run.
- Notes about any new dependencies or configuration.

## Security & Configuration Tips

Do not commit secrets, API keys, `.env` files, generated builds, or dependency folders. The app uses local demo logic and requires no credentials. If an LLM integration is added, keep provider keys in environment variables.
