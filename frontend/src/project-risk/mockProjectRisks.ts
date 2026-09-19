export type MockProjectRiskViewModel = {
  readonly id: string
  readonly name: string
  readonly assessmentState: 'available' | 'unavailable'
  readonly assessmentText: string
  readonly explanatoryFactors: readonly string[]
}

export const mockProjectRisks: readonly MockProjectRiskViewModel[] = [
  {
    id: 'project-a-mock',
    name: 'Dự án A [Minh họa]',
    assessmentState: 'available',
    assessmentText: '[Cách biểu diễn rủi ro: Chưa xác định]',
    explanatoryFactors: [
      'Yếu tố giải thích A [Minh họa]',
      'Yếu tố giải thích B [Minh họa]',
      'Yếu tố giải thích C [Minh họa]',
    ],
  },
  {
    id: 'project-b-mock',
    name: 'Dự án B [Minh họa]',
    assessmentState: 'unavailable',
    assessmentText: 'Chưa thể đánh giá rủi ro',
    explanatoryFactors: [],
  },
]
