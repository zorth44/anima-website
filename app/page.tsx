"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimeRecommendationCard } from "@/components/anime-recommendation-card"
import type { AnimeRecommendation } from "@/lib/types"

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  // Handle search form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    setRecommendations([])

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api"}/anime/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: searchQuery,
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON")
      }

      const data = await response.json()
      setRecommendations(data)
    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setError("获取推荐失败，请稍后再试。")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            今天看点什么动漫
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container py-8 flex flex-col">
        {/* Search Section */}
        <div className={`flex flex-col items-center justify-center ${recommendations.length > 0 ? "mb-12" : "flex-1"}`}>
          <div className="w-full max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              今天想看什么动漫？
            </h1>
            <p className="text-muted-foreground mb-8">告诉我你的心情或喜好，我会为你推荐适合的动漫</p>

            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                placeholder="例如：我想看充满青春气息，画风精美的高中日常动漫"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-5 pr-14 text-lg rounded-full border-2 focus-visible:ring-pink-500"
                disabled={isSearching}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-pink-500 hover:bg-pink-600 h-10 w-10"
                disabled={isSearching}
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                <span className="sr-only">搜索</span>
              </Button>
            </form>

          </div>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-t-pink-500 border-r-transparent border-b-pink-300 border-l-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="h-12 w-12 text-pink-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-lg font-medium">正在寻找适合你的动漫...</p>
            <p className="text-muted-foreground mt-2">这可能需要一点时间</p>
          </div>
        )}

        {/* Error State */}
        {error && !isSearching && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setError(null)}>
              重试
            </Button>
          </div>
        )}

        {/* Results */}
        {!isSearching && recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">为你推荐的动漫</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <AnimeRecommendationCard
                  key={recommendation.anime.id}
                  anime={recommendation.anime}
                  reason={recommendation.recommendationReason}
                  onClick={() => router.push(`/anime/${recommendation.anime.tmdbId}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-14">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 今天看点什么动漫. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              关于我们
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              隐私政策
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              使用条款
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
