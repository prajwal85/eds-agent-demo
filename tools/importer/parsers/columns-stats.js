/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-stats
 * Base block: columns
 * Source: https://www.ets.org/gre.html
 * Selector: .statBreakerModule .c-stat-breaker
 * Generated: 2026-05-14
 *
 * Extracts two side-by-side statistic cards from the stat breaker module.
 * Each card has a primary stat (percentage) and a description.
 * Maps to Columns block with 1 row, 2 columns.
 *
 * Source structure:
 *   .c-stat-breaker
 *     ul.c-stat-breaker__card-container
 *       li > .c-stat-breaker-card > div
 *         span.c-stat-breaker-card__primary-stat  ("81%")
 *         span.c-stat-breaker-card__description    ("of GRE test takers...")
 *
 * Target structure (from block library):
 *   | Columns (stats) |
 *   | Column 1 content | Column 2 content |
 *
 * xwalk note: Columns blocks do NOT require field hint comments per hinting rules.
 */
export default function parse(element, { document }) {
  // Extract all stat cards from the source element
  const statCards = element.querySelectorAll('.c-stat-breaker-card');

  // Build column content for each stat card
  const columnContents = [];

  statCards.forEach((card) => {
    const container = document.createDocumentFragment();

    // Extract primary stat (e.g. "81%") - render as heading for semantic weight
    const primaryStat = card.querySelector('.c-stat-breaker-card__primary-stat');
    if (primaryStat) {
      const heading = document.createElement('h2');
      heading.textContent = primaryStat.textContent.trim();
      container.appendChild(heading);
    }

    // Extract description text
    const description = card.querySelector('.c-stat-breaker-card__description');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      container.appendChild(p);
    }

    columnContents.push(container);
  });

  // Build cells array: single row with one cell per column
  // Matches block library: | Column 1 content | Column 2 content |
  const cells = [];
  if (columnContents.length >= 2) {
    cells.push([columnContents[0], columnContents[1]]);
  } else if (columnContents.length === 1) {
    // Fallback: single column if only one stat card found
    cells.push([columnContents[0]]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
