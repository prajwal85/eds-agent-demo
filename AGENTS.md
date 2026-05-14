# Agent Context — UT Austin EDS Migration

## Project Summary

Migrating www.utexas.edu (Drupal 11) to AEM Edge Delivery Services (xwalk project).
54+ pages identified, 20 currently migrated. Homepage fully styled with custom blocks.

## File Map

| File | Purpose | When to read |
|------|---------|--------------|
| `CLAUDE.md` | Rules, commands, git workflow | Always — behavioral guardrails |
| `Instructions.md` | Technical reference (blocks, parsers, templates, DOM) | When building/debugging |
| `CONTEXT.md` | Brand/design tokens and visual rules | When styling or evaluating visuals |
| `MIGRATION-PROMPT.md` | Page migration prompt with checklist | Before migrating new pages |
| `MIGRATION-CONTEXT.md` | Lessons learned and post-import procedures | After running the importer |

## Decision Log

| Decision | Reason |
|----------|--------|
| Force-add content to git | `/content` in `.git/info/exclude` for AEM delivery reasons |
| Download images locally | External URLs break in EDS production CDN |
| Use hero-video for video pages | Distinct from hero-banner; auto-creates `<video>` element |
| Manual post-import fixes | Importer can't detect all Drupal block types |
| styles.css is frozen | Brand design complete; changes break all pages |
| ≥70% similarity → reuse block | Prevents block sprawl; use variants instead |
