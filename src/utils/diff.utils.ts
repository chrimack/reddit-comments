import { diffWords, type ChangeObject } from 'npm:diff';

const CONFIG = {
  contextWindow: 2, // words
  maxAddedLength: 40, // characters
  maxChanges: 3,
};

const ELLIPSIS = '…';

function sanitizeText(text: string): string {
  return text.replace(/\n+/g, ' ').trim();
}

function getContextBefore(diff: ChangeObject<string>[], index: number): string {
  const previousPart = diff.at(index - 1);
  if (!previousPart) return '';

  return sanitizeText(previousPart.value)
    .split(' ')
    .slice(-CONFIG.contextWindow)
    .join(' ');
}

function getContextAfter(diff: ChangeObject<string>[], index: number): string {
  const nextPart = diff.at(index + 1);
  if (!nextPart) return '';

  return sanitizeText(nextPart.value)
    .split(' ')
    .slice(0, CONFIG.contextWindow)
    .join(' ');
}

function formatAddedText(text: string): string {
  const sanitizedText = sanitizeText(text);
  return sanitizedText.length > CONFIG.maxAddedLength
    ? sanitizedText.slice(0, CONFIG.maxAddedLength - 1) + ELLIPSIS
    : sanitizedText;
}

function createChangeEntry(
  diff: ChangeObject<string>[],
  index: number,
  addedText: string
): string {
  const beforeText = getContextBefore(diff, index);
  const afterText = getContextAfter(diff, index);
  const formatted = formatAddedText(addedText);
  const before = beforeText.length ? ELLIPSIS + beforeText + ' ' : ELLIPSIS;
  const after = afterText.length ? ' ' + afterText + ELLIPSIS : '';

  return `➕ "…${before}${formatted}${after}"`;
}

function extractAddedChanges(diff: ChangeObject<string>[]): string[] {
  const changes: string[] = [];

  for (let i = 0; i < diff.length; i++) {
    const part = diff[i];

    if (part.added && part.value.trim()) {
      const changeEntry = createChangeEntry(diff, i, part.value);
      changes.push(changeEntry);
    }
  }

  return changes;
}

function getCommentDiff(oldBody: string, newBody: string) {
  const diff = diffWords(oldBody, newBody, { ignoreCase: true });
  const changes = extractAddedChanges(diff);

  if (changes.length === 0) return 'No visible changes.';

  return changes.slice(0, CONFIG.maxChanges).join('\n');
}

export const DiffUtils = {
  getCommentDiff,
};
