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
      state: 'empty',
      projectId: 'project-alpha-mock',
    },
    {
      state: 'available',
      projectId: 'project-a-mock',
      candidates: [
        {
          id: 'candidate-a-mock',
          displayLabel: 'Ứng viên A',
          explanation:
            'Giải thích minh họa về mức độ phù hợp với nhu cầu của dự án.',
        },
        {
          id: 'candidate-b-mock',
          displayLabel: 'Ứng viên B',
          explanation:
            'Giải thích minh họa về mức độ phù hợp với nhu cầu của dự án.',
        },
      ],
    },
    {
      state: 'empty',
      projectId: 'project-b-mock',
    },
    {
      state: 'empty',
      projectId: 'project-c-mock',
    },
  ]
