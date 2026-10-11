export type MockProjectRiskViewModel = {
  readonly id: string
  readonly name: string
  readonly assessmentState: 'available' | 'unavailable'
  readonly assessmentText: string
  readonly explanatoryFactors: readonly string[]
}

export const mockProjectRisks: readonly MockProjectRiskViewModel[] = [
  {
    id: 'project-alpha-mock',
    name: 'Dự án Alpha',
    assessmentState: 'unavailable',
    assessmentText: 'Chưa thể đánh giá rủi ro',
    explanatoryFactors: [],
  },
  {
    id: 'project-a-mock',
    name: 'Dự án A',
    assessmentState: 'available',
    assessmentText: '[Cách biểu diễn rủi ro: Chưa xác định]',
    explanatoryFactors: [
      'Yếu tố giải thích A',
      'Yếu tố giải thích B',
      'Yếu tố giải thích C',
    ],
  },
  {
    id: 'project-b-mock',
    name: 'Dự án B',
    assessmentState: 'unavailable',
    assessmentText: 'Chưa thể đánh giá rủi ro',
    explanatoryFactors: [],
  },
  {
    id: 'project-c-mock',
    name: 'Dự án C',
    assessmentState: 'available',
    assessmentText: '[Cách biểu diễn rủi ro: Chưa xác định]',
    explanatoryFactors: [
      'Yếu tố giải thích A',
      'Yếu tố giải thích B',
    ],
  },
]
