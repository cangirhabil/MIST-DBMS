export interface SearchParams {
  query: string
  genre: string
  yearRange: [number, number]
  sortBy: 'rating' | 'year' | 'title' | 'relevance'
}
