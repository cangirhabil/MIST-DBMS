// app/api/search-movies/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { query, genre, yearRange, sortBy } = await request.json()

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
            return { title: 'asc' } // varsayılan sıralama
        }
      })(),
      take: 20,
    })

    // API yanıtını istediğimiz formata dönüştürme
    const formattedMovies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      releaseYear: movie.releaseYear,
      posterUrl: movie.posterUrl,
      rating: movie.rating,
      director: movie.director,
      duration: movie.duration,
      overview: movie.overview,
      genres: movie.genres.map((genre) => genre.name),
    }))

    return NextResponse.json({ movies: formattedMovies })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
