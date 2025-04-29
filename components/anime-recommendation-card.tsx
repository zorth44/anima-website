"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPosterUrl } from "@/lib/api"
import type { AnimeData } from "@/lib/types"

interface AnimeRecommendationCardProps {
  anime: AnimeData
  reason: string
  onClick: () => void
}

export function AnimeRecommendationCard({ anime, reason, onClick }: AnimeRecommendationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="grid grid-cols-[120px_1fr] h-full">
        <div className="relative h-full">
          <img
            src={getPosterUrl(anime.posterPath, "w342") || "/placeholder.svg"}
            alt={anime.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70 hover:bg-black/70 text-white">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {anime.voteAverage.toFixed(1)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{anime.name}</h3>
          <p className="text-xs text-muted-foreground mb-2">{anime.originalName}</p>

          <div className="bg-muted/30 p-3 rounded-md flex-1">
            <p className="text-sm line-clamp-4">{reason}</p>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">{anime.firstAirDate || anime.releaseDate}</div>
        </CardContent>
      </div>
    </Card>
  )
}
