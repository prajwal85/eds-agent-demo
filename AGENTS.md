# Agent Context — EDS Migration

## Project Summary

Migrating [{Source_Site}](https://www.ets.org/gre.html) to AEM Edge Delivery Services.

see @templates/Instructions.md
see @templates/Context.md

## File Map

| File | Purpose | When to read |
|------|---------|--------------|
| `CLAUDE.md` | Rules, commands, git workflow | Always — behavioral guardrails |
| `Instructions.md` | Technical reference (blocks, parsers, templates, DOM), Lessons learned and post-import procedures  | When building/debugging |
| `CONTEXT.md` | Brand/design tokens and visual rules | When styling or evaluating visuals |
| `MIGRATION-CONTEXT.md` | Migration Stats, Assets and content migrated count and details | After running the importer |

## Decision Log

| Decision | Reason |
|----------|--------|
| Force-add content to git | `/content` in `.git/info/exclude` for AEM delivery reasons |
| Download images locally | External URLs break in EDS production CDN |
| Use hero-video for video pages | Distinct from hero-banner; auto-creates `<video>` element |
| Manual post-import fixes | Importer can't detect all Drupal block types |
| styles.css is frozen | Brand design complete; changes break all pages |
| ≥70% similarity → reuse block | Prevents block sprawl; use variants instead |
