export interface AnimeData {
  id: number
  tmdbId: number
  name: string
  originalName: string
  originalLanguage: string
  overview: string
  firstAirDate: string
  releaseDate: string | null
  mediaType: string
  adult: boolean
  popularity: number
  voteAverage: number
  voteCount: number
  posterPath: string
  backdropPath: string
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AnimeQueryResponse {
  content: AnimeData[]
  totalPages: number
  totalElements: number
  currentPage: number
  pageSize: number
}

export interface TimelineItem {
  yearMonth: string
  animeList: AnimeData[]
}
