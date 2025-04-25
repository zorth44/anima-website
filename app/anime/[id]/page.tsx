"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Calendar, Clock, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAnimeById, getPosterUrl, getBackdropUrl } from "@/lib/api"
import type { AnimeData } from "@/lib/types"

export default function AnimePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [anime, setAnime] = useState<AnimeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnime() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getAnimeById(Number.parseInt(id))
        setAnime(data)
      } catch (err) {
        console.error("Error fetching anime:", err)
        setError("Failed to load anime details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnime()
  }, [id])

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
      <div className="relative h-[50vh] overflow-hidden">
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

      <div className="container relative z-20 -mt-32 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
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
                <h1 className="text-3xl font-bold">{anime.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{anime.originalName}</p>
                <div className="flex items-center gap-4 mt-2">
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
                <ExternalLink className="mr-2 h-4 w-4" />
                Watch Now
              </Button>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-muted-foreground">{anime.overview || "No synopsis available."}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Original Title</p>
                  <p className="text-sm text-muted-foreground">{anime.originalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">{anime.originalLanguage.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Popularity</p>
                  <p className="text-sm text-muted-foreground">{anime.popularity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Vote Count</p>
                  <p className="text-sm text-muted-foreground">{anime.voteCount}</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6 sm:hidden">
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
