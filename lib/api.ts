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

// Function to get episode still image URL
export function getStillUrl(stillPath: string | null, size = "w300"): string {
  if (!stillPath) return "/bustling-city-street.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${stillPath}`
}

// Function to search anime
export async function searchAnime(params: {
  keyword?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}) {
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

// Remove the incorrect getAnimeById function and replace it with:

// We don't need this function as there's no direct endpoint for it
// export async function getAnimeById(tmdbId: number) {
//   const response = await fetch(`${API_BASE_URL}/anime/${tmdbId}`)
//
//   if (!response.ok) {
//     throw new Error(`API error: ${response.status}`)
//   }
//
//   return response.json()
// }

// Update the getAnimeSeasons function to use the correct endpoint
export async function getAnimeSeasons(tmdbId: number) {
  const response = await fetch(`${API_BASE_URL}/anime/${tmdbId}/seasons`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Update the getSeasonEpisodes function to use the correct endpoint
export async function getSeasonEpisodes(tmdbId: number, seasonNumber: number) {
  const response = await fetch(`${API_BASE_URL}/anime/${tmdbId}/seasons/${seasonNumber}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Update the getEpisodeDetails function to use the correct endpoint
export async function getEpisodeDetails(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  const response = await fetch(`${API_BASE_URL}/anime/${tmdbId}/seasons/${seasonNumber}/episodes/${episodeNumber}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
