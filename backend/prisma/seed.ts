import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import process from "process";
import { config } from "dotenv";
config();
async function main() {
  // Önce bazı Genre'ler oluşturalım
  const genres = await Promise.all([
    prisma.genre.create({ data: { name: "Action" } }),
    prisma.genre.create({ data: { name: "Drama" } }),
    prisma.genre.create({ data: { name: "Comedy" } }),
    prisma.genre.create({ data: { name: "Sci-Fi" } }),
    prisma.genre.create({ data: { name: "Thriller" } }),
  ]);

  // Filmler için örnek veriler
  const movies = [
    {
      title: "Inception",
      releaseYear: 2010,
      posterUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8jIZ4ghU8MiF_BbvSUquG7zEDzlA_rXiqnA&s",
      rating: 8.8,
      director: "Christopher Nolan",
      duration: 148,
      overview:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      genres: {
        connect: [
          { id: genres[0].id }, // Action
          { id: genres[3].id }, // Sci-Fi
        ],
      },
    },
    {
      title: "The Shawshank Redemption",
      releaseYear: 1994,
      posterUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS722S1l81YpJwNBStUa22a01ElJDtIUGSSHg&s",
      rating: 9.3,
      director: "Frank Darabont",
      duration: 142,
      overview:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      genres: {
        connect: [
          { id: genres[1].id }, // Drama
        ],
      },
    },
    {
      title: "The Dark Knight",
      releaseYear: 2008,
      posterUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpvyijfsP4F8o9bqAZc6bxCdbAYeKc582P1A&s",
      rating: 9.0,
      director: "Christopher Nolan",
      duration: 152,
      overview:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      genres: {
        connect: [
          { id: genres[0].id }, // Action
          { id: genres[4].id }, // Thriller
        ],
      },
    },
    {
      title: "Pulp Fiction",
      releaseYear: 1994,
      posterUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0110912%2F&psig=AOvVaw1pD2S1t522J3Y-nM2lhAxO&ust=1734287692003000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMCt95_zp4oDFQAAAAAdAAAAABAE",
      rating: 8.9,
      director: "Quentin Tarantino",
      duration: 154,
      overview:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      genres: {
        connect: [
          { id: genres[1].id }, // Drama
          { id: genres[4].id }, // Thriller
        ],
      },
    },
    {
      title: "The Grand Budapest Hotel",
      releaseYear: 2014,
      posterUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST7crKM6SAMBgsDrI_wrEJnS3lcfyq90l7Vw&s",
      rating: 8.1,
      director: "Wes Anderson",
      duration: 99,
      overview:
        "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
      genres: {
        connect: [
          { id: genres[2].id }, // Comedy
          { id: genres[1].id }, // Drama
        ],
      },
    },
  ];

  // Filmleri veritabanına ekleyelim
  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
  }

  console.log("Seed data has been successfully added!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
