// Constants for API and image URLs
export const API_BASE_URL = "http://127.0.0.1:8080/api"
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Function to get poster image URL
export function getPosterUrl(posterPath: string | null, size = "w500"): string {
  if (!posterPath) return "/vibrant-cityscape-night.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
}

// Function to get backdrop image URL
export function getBackdropUrl(backdropPath: string | null, size = "original"): string {
  if (!backdropPath) return "/vibrant-cityscape.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
}

export interface AnimeQueryResponse {
  data: any[]
  pagination: {
    current_page: number
    has_next_page: boolean
    items_per_page: number
    total_items: number
    total_pages: number
  }
}

export interface AnimeData {
  id: number
  attributes: any
}

// Function to search anime
export async function searchAnime(params: {
  keyword?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}): Promise<AnimeQueryResponse> {
  const queryParams = new URLSearchParams()

  if (params.keyword) queryParams.append("keyword", params.keyword)
  if (params.startDate) queryParams.append("startDate", params.startDate)
  if (params.endDate) queryParams.append("endDate", params.endDate)
  if (params.page !== undefined) queryParams.append("page", params.page.toString())
  if (params.size !== undefined) queryParams.append("size", params.size.toString())

  const response = await fetch(`${API_BASE_URL}/anime/search?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Function to get anime by ID
export async function getAnimeById(id: number): Promise<AnimeData> {
  const response = await fetch(`${API_BASE_URL}/anime/${id}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
