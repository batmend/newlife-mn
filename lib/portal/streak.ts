/**
 * Consecutive published words read, counting back from the latest one.
 * Today's word doesn't break the streak until the day is over.
 */
export function readingStreak(wordDatesDesc: string[], readDates: Set<string>, today: string) {
  let streak = 0;
  for (const [index, date] of wordDatesDesc.entries()) {
    if (readDates.has(date)) {
      streak += 1;
    } else if (index === 0 && date === today) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}
