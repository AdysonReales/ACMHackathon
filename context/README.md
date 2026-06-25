---
context_role: index
owner: context_map
read_when: mapping context files or choosing what to read next
stability: stable
update_mode: pointers_only
---

# Context Directory

This directory uses lightweight context engineering for human and AI collaboration.

Frontmatter in `context/*.md` routes attention. Run the context map, then read the body of a file only when its `read_when` field matches the task.

```sh
python3 scripts/context_map.py
```

## Private Local Files

These files may exist locally or in a private team channel, but should not be committed to a public repository unless reviewed:

- `PROJECT_GUIDE.md`
- `DECISIONS.md`
- `PROJECT_HANDOFF.md`
- `TEAM_INTERNAL.md`
- `UI.md`

If the repository is public, use the `.gitignore.public-repo-snippet` from the template to keep private context files out of Git.

## Context Ownership

Keep each fact in one owning file and use pointers from other files. If two files conflict, update the stale file instead of adding another explanation.

- **`PROJECT_GUIDE.md`**: Stable project rules, source order, and collaboration guide.
- **`DECISIONS.md`**: Durable major decisions and the rationale behind them.
- **`PROJECT_HANDOFF.md`**: Current state, blockers, verification gaps, and next focus.
- **`TEAM_INTERNAL.md`**: Private team workflow, repository sharing rules, and push/PR safety checks.
- **`UI.md`**: Current visual design system (tokens, typography, spacing, rules).
- **Root `README.md`**: Public setup and usage of the actual project.

Before editing context files, decide which file owns each fact. After editing, scan for copied details that should be replaced by pointers.

