// app/api/search-movies/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, ApiError } from '@/lib/error'
import type { Movie, SearchParams } from '@/types/Movie'

export async function POST(request: Request) {
  try {
    const { query, genre, yearRange, sortBy } = (await request.json()) as SearchParams

    if (!query && genre === 'all') {
      throw new ApiError(400, 'Search query or genre is required')
    }

    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            overview: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
        ...(genre !== 'all' && {
          genres: {
            some: {
              name: genre,
            },
          },
        }),
        releaseYear: {
          gte: yearRange[0],
          lte: yearRange[1],
        },
      },
      include: {
        genres: true,
      },
      orderBy: (() => {
        switch (sortBy) {
          case 'rating':
            return { rating: 'desc' }
          case 'year':
            return { releaseYear: 'desc' }
          case 'title':
            return { title: 'asc' }
          default:
            return {
              _relevance: {
                fields: ['title', 'overview'],
                search: query,
                sort: 'desc',
              },
            }
        }
      })(),
      take: 20,
    })

    const formattedMovies = movies.map((movie:Movie) => ({
      id: movie.id,
      title: movie.title,
      releaseYear: movie.releaseYear,
      posterUrl: movie.posterUrl,
      rating: movie.rating,
      director: movie.director,
      duration: movie.duration,
      overview: movie.overview,
      genres: movie.genres.map((genre) => genre),
    }))

    return NextResponse.json({ movies: formattedMovies })
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error)
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
