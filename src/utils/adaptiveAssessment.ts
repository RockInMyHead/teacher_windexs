// Stub for adaptive assessment - to be implemented later
export async function runAdaptiveAssessment(
  grade: number,
  topic: string,
  questionCallback: (question: any, num: number) => Promise<string>
): Promise<void> {
  // Stub implementation - does nothing for now
  console.log('Adaptive assessment not implemented yet', { grade, topic });
}
