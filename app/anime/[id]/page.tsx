"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Calendar, Clock, Loader2, ChevronDown, ChevronUp, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getAnimeSeasons, getSeasonEpisodes, getPosterUrl, getBackdropUrl, getStillUrl } from "@/lib/api"
import type { AnimeData, Season, SeasonDetail, Episode } from "@/lib/types"

export default function AnimePage() {
  const params = useParams()
  const router = useRouter()
  const tmdbId = Number.parseInt(params.id as string)

  const [anime, setAnime] = useState<AnimeData | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null)
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<number, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch seasons directly using tmdbId
  useEffect(() => {
    async function fetchSeasons() {
      setIsLoading(true)
      setError(null)

      try {
        const seasonsData = await getAnimeSeasons(tmdbId)
        setSeasons(seasonsData)

        // If seasons exist, set anime data from the first season and fetch episodes
        if (seasonsData.length > 0) {
          setAnime(seasonsData[0].anime)
          const firstSeason = seasonsData[0].seasonNumber
          setSelectedSeason(firstSeason)
          fetchEpisodes(firstSeason)
        } else {
          setIsLoading(false)
          setError("No seasons found for this anime.")
        }
      } catch (err) {
        console.error("Error fetching seasons:", err)
        setError("Failed to load seasons. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchSeasons()
  }, [tmdbId])

  // Fetch episodes for a season
  async function fetchEpisodes(seasonNumber: number) {
    setIsLoadingEpisodes(true)

    try {
      const seasonData = await getSeasonEpisodes(tmdbId, seasonNumber)
      setSeasonDetail(seasonData)

      // Initialize expanded state for episodes
      const initialExpandedState: Record<number, boolean> = {}
      seasonData.episodes.forEach((episode: Episode) => {
        initialExpandedState[episode.episode_number] = false
      })
      setExpandedEpisodes(initialExpandedState)

      setIsLoading(false)
      setIsLoadingEpisodes(false)
    } catch (err) {
      console.error("Error fetching episodes:", err)
      setError("Failed to load episodes. Please try again later.")
      setIsLoading(false)
      setIsLoadingEpisodes(false)
    }
  }

  // Handle season change
  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber)
    fetchEpisodes(seasonNumber)
  }

  // Toggle episode expansion
  const toggleEpisode = (episodeNumber: number) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeNumber]: !prev[episodeNumber],
    }))
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{error || "Anime not found"}</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />
        <img
          src={getBackdropUrl(anime.backdropPath) || "/placeholder.svg"}
          alt={anime.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 z-20">
          <Button variant="ghost" className="text-white" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container relative z-20 -mt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden border-4 border-background shadow-xl">
              <img
                src={getPosterUrl(anime.posterPath) || "/placeholder.svg"}
                alt={anime.name}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
          </div>

          <div className="bg-background rounded-lg p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{anime.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{anime.originalName}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{anime.voteAverage.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{anime.firstAirDate || anime.releaseDate || "Unknown date"}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{anime.mediaType.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <Button className="hidden sm:flex">
                <Play className="mr-2 h-4 w-4" />
                Watch Now
              </Button>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
              <p className="text-muted-foreground text-sm">{anime.overview || "No synopsis available."}</p>
            </div>
          </div>
        </div>

        {/* Seasons and Episodes Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Seasons & Episodes</h2>

          {seasons.length > 0 ? (
            <div className="space-y-6">
              {/* Season Selector */}
              {seasons.length > 1 && (
                <Tabs
                  defaultValue={selectedSeason.toString()}
                  onValueChange={(value) => handleSeasonChange(Number.parseInt(value))}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                    {seasons.map((season) => (
                      <TabsTrigger key={season.seasonNumber} value={season.seasonNumber.toString()} className="text-sm">
                        {season.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}

              {/* Episodes List */}
              {isLoadingEpisodes ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : seasonDetail && seasonDetail.episodes.length > 0 ? (
                <div className="space-y-4">
                  {seasonDetail.episodes.map((episode) => (
                    <Card key={episode.id} className="overflow-hidden">
                      <div
                        className="p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleEpisode(episode.episode_number)}
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="h-8 w-8 rounded-full flex items-center justify-center p-0"
                          >
                            {episode.episode_number}
                          </Badge>
                          <div>
                            <h3 className="font-medium">{episode.name}</h3>
                            <p className="text-xs text-muted-foreground">{episode.air_date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {expandedEpisodes[episode.episode_number] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {expandedEpisodes[episode.episode_number] && (
                        <CardContent className="pt-0">
                          <Separator className="my-2" />
                          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 mt-2">
                            {episode.still_path && (
                              <img
                                src={getStillUrl(episode.still_path) || "/placeholder.svg"}
                                alt={`Episode ${episode.episode_number}`}
                                className="w-full rounded-md object-cover aspect-video"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{episode.runtime} min</span>
                              </div>
                              <p className="text-sm">{episode.overview || "No description available."}</p>
                              <Button size="sm" className="mt-4">
                                <Play className="mr-2 h-3 w-3" />
                                Watch Episode
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">No episodes available for this season.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No seasons available for this anime.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
