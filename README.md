# Lightweight Context Engineering Template

> **Template Usage Instructions**
> When you clone this template for a real project, this `README.md` should be replaced with your project's actual documentation (what it does, how to run it, etc.). 
> 
> You can safely **delete everything in this file** except for the **AI Start Prompt** relevant to your repo mode (Private or Public). Keep that prompt at the bottom of your new `README.md` or move it to a tool-specific file like `.cursor/rules` or `AGENTS.md`. The meta-documentation for how the context system works will safely remain in `context/README.md`.

Use this template to give teammates and AI tools a small, current source of truth for a project.

The template provides a `context/` directory plus a small generic `scripts/context_map.py` helper. It supports two repository modes:

- Private repository mode: commit the whole `context/` directory if every file is safe for all repository readers.
- Public repository mode: commit only public-safe context files (`README.md`) and keep private team/AI files local or in a private companion channel.

## Private Repository Mode

Use this mode when every repository reader is allowed to see the team's working context.

Copy the `context/` directory and `scripts/context_map.py` into a project root and commit them:

```text
project/
  context/
    PROJECT_GUIDE.md
    DECISIONS.md
    PROJECT_HANDOFF.md
    TEAM_INTERNAL.md
    UI.md
  scripts/
    context_map.py
```

**AI Start Prompt (Private Mode):**
```md
Read `context/README.md` first. Resolve low-risk ambiguity by inspecting files; ask before acting on risky or hard-to-reverse assumptions.
```

## Public Repository Mode

Use this mode when organizers, judges, clients, competitors, or the public can view the repository.

Recommended tracked files:

```text
project/
  context/
    README.md
  scripts/
    context_map.py
```

Then merge `.gitignore.public-repo-snippet` into the project's real `.gitignore`. It ignores private context files while allowing public-safe context files to remain tracked.

Recommended local/private companion files:

```text
project/
  context/
    PROJECT_GUIDE.md
    DECISIONS.md
    PROJECT_HANDOFF.md
    TEAM_INTERNAL.md
    UI.md
```

**AI Start Prompt (Public Mode):**
```md
Read `context/README.md` first. If private context such as `PROJECT_GUIDE.md`, `DECISIONS.md`, `PROJECT_HANDOFF.md`, `TEAM_INTERNAL.md`, or `UI.md` is missing, ask for it when needed instead of inventing missing project facts. Resolve low-risk ambiguity by inspecting files; ask before acting on risky or hard-to-reverse assumptions.
```

## Optional AI Tool Adapters

If an AI tool expects a special instruction file such as `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, or `.github/copilot-instructions.md`, keep that file thin. It should simply contain the relevant AI Start Prompt for your mode (listed above).
