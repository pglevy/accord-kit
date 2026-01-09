# UI Bootstrap Skill

## Purpose
Automatically initialize the React UI with Sailwind components when needed. This skill should be invoked proactively by the agent whenever UI development is requested and no UI exists yet.

## When to Use This Skill

**PROACTIVE USAGE**: The agent should check for and invoke this skill automatically when:
- User asks to build/create UI pages or components
- User requests a form, dashboard, or any web interface
- User mentions needing a frontend or UI
- Any task requires web UI development

**Check First**: Before invoking, verify that `ui/` directory doesn't already exist.

## What This Skill Does

1. **Validates** that UI doesn't already exist
2. **Copies** the template from `templates/ui/` to `ui/`
3. **Installs** all npm dependencies in the UI directory
4. **Reports** success and next steps to the user

## Implementation

The skill executes the init script:

```bash
npm run ui:init
```

This script:
- Checks if `ui/` already exists (fails if it does)
- Copies entire `templates/ui/` directory to `ui/`
- Runs `npm install` in the new `ui/` directory
- Provides guidance on next steps

## What Gets Created

After running this skill, the project will have:

```
ui/
├── src/
│   ├── pages/           # Example pages (home, example-form)
│   ├── api.ts          # Backend integration patterns
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Aurora theme + Sailwind styles
├── public/             # Static assets
├── package.json        # Dependencies (React, Vite, Sailwind)
├── vite.config.ts      # Vite with API proxy
└── README.md           # UI documentation
```

## After Bootstrap

Once the UI is initialized:

1. **Development server**: User can run `cd ui && npm run dev`
2. **URL**: UI available at `http://localhost:5173`
3. **API proxy**: Vite proxies `/api/*` to `http://localhost:3000`
4. **Backend required**: Skills backend should be running on port 3000

## Next Steps After Bootstrapping

The agent should then:

1. Inform the user the UI has been initialized
2. Ask what page or feature they want to build
3. Create pages in `ui/src/pages/` using Sailwind components
4. Update `ui/src/api.ts` with domain-specific types and endpoints
5. Follow guidance in `AGENTS.md` for Sailwind component usage

## Example Agent Workflow

```
User: "Let's build a form to create tickets"

Agent:
1. Checks if ui/ exists
2. If not, invokes this skill to bootstrap UI
3. Creates ticket form page in ui/src/pages/
4. Updates api.ts with ticket types
5. Runs npm run build to validate
6. Informs user the form is ready
```

## Important Notes

- **Proactive**: Agent should invoke this automatically, not wait for user to ask
- **One-time**: Skill only needs to run once per project
- **Check first**: Always verify ui/ doesn't exist before running
- **Dependencies**: Takes ~1 minute to install npm packages
- **AGENTS.md**: Reference this file for all UI development guidance

## Error Handling

If `ui/` already exists:
- Skill will fail with clear error message
- Agent should proceed with UI development in existing directory
- No need to bootstrap again

## Integration with Skills Backend

The UI template includes `api.ts` with patterns for:
- Calling backend endpoints that execute skills
- Type definitions that match backend schema
- Error handling and loading states
- Example form submission flow

See `templates/ui/src/api.ts` for the integration pattern.
