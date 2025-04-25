"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, ListIcon, LayoutGridIcon, ImageIcon, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimeTimeline from "@/components/anime-timeline"
import { useTheme } from "next-themes"
import { searchAnime } from "@/lib/api"
import type { AnimeQueryResponse, TimelineItem } from "@/lib/types"

export default function Home() {
  const [viewMode, setViewMode] = useState<"list" | "card" | "waterfall">("card")
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [animeData, setAnimeData] = useState<AnimeQueryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch anime data
  useEffect(() => {
    async function fetchAnimeData() {
      setIsLoading(true)
      setError(null)

      try {
        const params: any = { size: 50 }

        if (debouncedSearchQuery) {
          params.keyword = debouncedSearchQuery
        }

        if (yearFilter !== "all") {
          params.startDate = `${yearFilter}-01-01`
          params.endDate = `${yearFilter}-12-31`
        }

        const data = await searchAnime(params)
        setAnimeData(data)
      } catch (err) {
        console.error("Error fetching anime data:", err)
        setError("Failed to fetch anime data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnimeData()
  }, [debouncedSearchQuery, yearFilter])

  // Filter anime based on rating
  const filteredAnime =
    animeData?.content.filter((anime) => {
      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "8+" && anime.voteAverage >= 8) ||
        (ratingFilter === "7+" && anime.voteAverage >= 7) ||
        (ratingFilter === "6+" && anime.voteAverage >= 6)

      return matchesRating
    }) || []

  // Group anime by year and month
  const groupedAnime = filteredAnime.reduce(
    (acc, anime) => {
      // Use firstAirDate if available, otherwise use releaseDate
      const dateString = anime.firstAirDate || anime.releaseDate

      if (!dateString) return acc

      const [year, month] = dateString.split("-")
      const yearMonth = `${year}-${month}`

      if (!acc[yearMonth]) {
        acc[yearMonth] = []
      }

      acc[yearMonth].push(anime)
      return acc
    },
    {} as Record<string, typeof filteredAnime>,
  )

  // Sort by year-month (newest first)
  const sortedTimelineKeys = Object.keys(groupedAnime).sort().reverse()

  // Create timeline data
  const timelineData: TimelineItem[] = sortedTimelineKeys.map((key) => ({
    yearMonth: key,
    animeList: groupedAnime[key],
  }))

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already handled by the debounced effect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              AnimeTimeline
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-8">
          <div className="relative h-[400px] overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10 flex flex-col items-center justify-center p-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Discover Anime</h2>
              <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto relative">
                <Input
                  placeholder="Search for anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-5 pr-12 text-lg rounded-full border-2 border-white/20 bg-black/30 backdrop-blur-sm text-white placeholder:text-white/70 focus-visible:ring-pink-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-pink-500 hover:bg-pink-600"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  <span className="sr-only">Search</span>
                </Button>
              </form>

              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[140px] bg-black/30 border-white/20 text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[140px] bg-black/30 border-white/20 text-white">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="8+">8+ ★</SelectItem>
                    <SelectItem value="7+">7+ ★</SelectItem>
                    <SelectItem value="6+">6+ ★</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
            <img src="/konosuba-background.png" alt="Anime Background" className="w-full h-full object-cover" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-8 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {isLoading && !animeData ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : timelineData.length > 0 ? (
          <AnimeTimeline timelineData={timelineData} viewMode={viewMode} />
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No anime found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AnimeTimeline. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="border-primary/20"
    >
      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: "list" | "card" | "waterfall"
  setViewMode: (mode: "list" | "card" | "waterfall") => void
}) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        className="rounded-r-none"
        onClick={() => setViewMode("list")}
      >
        <ListIcon className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
      <Button
        variant={viewMode === "card" ? "default" : "ghost"}
        size="sm"
        className="rounded-none"
        onClick={() => setViewMode("card")}
      >
        <LayoutGridIcon className="h-4 w-4" />
        <span className="sr-only">Card view</span>
      </Button>
      <Button
        variant={viewMode === "waterfall" ? "default" : "ghost"}
        size="sm"
        className="rounded-l-none"
        onClick={() => setViewMode("waterfall")}
      >
        <ImageIcon className="h-4 w-4" />
        <span className="sr-only">Waterfall view</span>
      </Button>
    </div>
  )
}
