"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getPosterUrl } from "@/lib/api"
import type { TimelineItem, AnimeData } from "@/lib/types"

interface AnimeTimelineProps {
  timelineData: TimelineItem[]
  viewMode: "list" | "card" | "waterfall"
}

export default function AnimeTimeline({ timelineData, viewMode }: AnimeTimelineProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (yearMonth: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [yearMonth]: !prev[yearMonth],
    }))
  }

  const formatYearMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  return (
    <div className="space-y-8">
      {timelineData.map((item) => (
        <div key={item.yearMonth} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{formatYearMonth(item.yearMonth)}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(item.yearMonth)}
              className="flex items-center gap-1"
            >
              {expandedSections[item.yearMonth] ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-sm">Collapse</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-sm">Expand</span>
                </>
              )}
            </Button>
          </div>

          <div
            className={cn(
              "grid gap-4",
              viewMode === "list" && "grid-cols-1",
              viewMode === "card" && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              viewMode === "waterfall" && "columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-4",
            )}
          >
            {item.animeList.map((anime) => (
              <Link
                href={`/anime/${anime.id}`}
                key={anime.id}
                className={cn(viewMode === "waterfall" && "block mb-4 break-inside-avoid")}
              >
                {viewMode === "list" ? (
                  <AnimeListItem anime={anime} />
                ) : viewMode === "card" ? (
                  <AnimeCard anime={anime} />
                ) : (
                  <AnimeWaterfallItem anime={anime} />
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AnimeListItem({ anime }: { anime: AnimeData }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <img
        src={getPosterUrl(anime.posterPath) || "/placeholder.svg"}
        alt={anime.name}
        className="w-16 h-24 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-medium">{anime.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1">{anime.voteAverage.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">{anime.firstAirDate || anime.releaseDate}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{anime.overview}</p>
      </div>
    </div>
  )
}

function AnimeCard({ anime }: { anime: AnimeData }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getPosterUrl(anime.posterPath) || "/placeholder.svg"}
          alt={anime.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 hover:bg-black/70 text-white">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {anime.voteAverage.toFixed(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1">{anime.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{anime.firstAirDate || anime.releaseDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function AnimeWaterfallItem({ anime }: { anime: AnimeData }) {
  return (
    <div className="relative rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={getPosterUrl(anime.posterPath) || "/placeholder.svg"}
        alt={anime.name}
        className="w-full object-cover transition-transform hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
        <h3 className="font-medium text-white">{anime.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-white ml-1">{anime.voteAverage.toFixed(1)}</span>
          </div>
          <span className="text-xs text-white/80">{anime.firstAirDate || anime.releaseDate}</span>
        </div>
      </div>
    </div>
  )
}
