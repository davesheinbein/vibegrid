export function checkGroupValidity(
  selectedWords: string[],
  groups: Record<string, string[]>
): boolean {
  return Object.values(groups).some(group =>
    selectedWords.every(word => group.includes(word))
  );
}

export function partialMatchFeedback(
  selectedWords: string[],
  groups: Record<string, string[]>
): string {
  let highestMatch = 0;
  for (const group of Object.values(groups)) {
    const matchCount = selectedWords.filter(word => group.includes(word)).length;
    if (matchCount > highestMatch) highestMatch = matchCount;
  }
  return `${highestMatch} of these fit together.`;
}
