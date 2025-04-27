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

export interface Season {
  id: number
  anime: AnimeData
  tmdbSeasonId: number
  seasonNumber: number
  name: string
  overview: string
  airDate: string
  episodeCount: number
  posterPath: string
}

export interface SeasonDetail {
  id: number
  name: string
  overview: string
  seasonNumber: number
  episodes: Episode[]
}

export interface Episode {
  id: number
  name: string
  overview: string
  runtime: number
  episode_number: number
  air_date: string
  still_path: string
}

export interface EpisodeDetail {
  id: number
  name: string
  overview: string
  runtime: number
  episode_number: number
  air_date: string
  still_path: string
}
