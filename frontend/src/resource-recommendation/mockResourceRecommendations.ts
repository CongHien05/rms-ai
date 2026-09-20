export type MockRecommendationCandidatePresentation = {
  readonly id: string
  readonly displayLabel: string
  readonly explanation: string
}

export type MockResourceRecommendationPresentation =
  | {
      readonly state: 'available'
      readonly projectId: string
      readonly candidates: readonly MockRecommendationCandidatePresentation[]
    }
  | {
      readonly state: 'empty'
      readonly projectId: string
    }

export const mockResourceRecommendations: readonly MockResourceRecommendationPresentation[] =
  [
    {
      state: 'available',
      projectId: 'project-a-mock',
      candidates: [
        {
          id: 'candidate-a-mock',
          displayLabel: 'Ứng viên A [Minh họa]',
          explanation:
            'Giải thích mức độ phù hợp cho nhu cầu của dự án [Minh họa].',
        },
        {
          id: 'candidate-b-mock',
          displayLabel: 'Ứng viên B [Minh họa]',
          explanation:
            'Giải thích mức độ phù hợp cho nhu cầu của dự án [Minh họa].',
        },
      ],
    },
    {
      state: 'empty',
      projectId: 'project-b-mock',
    },
  ]
