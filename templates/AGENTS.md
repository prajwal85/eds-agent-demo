# Agent Context — {{PROJECT_NAME}}

## Project

Migrating {{SOURCE_SITE}} ({{SOURCE_CMS}}) to AEM Edge Delivery Services ({{PROJECT_TYPE}}).

## File Map

| File | Purpose | When to read |
|------|---------|--------------|
| `CLAUDE.md` | Rules, commands, git workflow | Always |
| `Instructions.md` | Blocks, parsers, templates, DOM selectors | When building/debugging |
| `CONTEXT.md` | Brand colors, typography, visual rules | When styling |
| `MIGRATION-PROMPT.md` | Migration workflow | Before migrating pages |

## Decision Log

| Decision | Reason |
|----------|--------|
| Force-add content to git | `/content` in .git/info/exclude for AEM delivery |
| Download images locally | External URLs break on EDS production CDN |
| styles.css frozen | Design complete; block-level CSS for changes |
| ≥70% similarity → reuse | Prevents block sprawl |
