-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "posterUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "director" TEXT,
    "duration" INTEGER,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MovieList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieWatchedList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "posterUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "director" TEXT,
    "duration" INTEGER,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieWatchedList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieListMovies" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieListMovies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MovieGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovieGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MovieWatchedList_userId_movieId_key" ON "MovieWatchedList"("userId", "movieId");

-- CreateIndex
CREATE INDEX "_MovieListMovies_B_index" ON "_MovieListMovies"("B");

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "_MovieGenres"("B");

-- AddForeignKey
ALTER TABLE "MovieList" ADD CONSTRAINT "MovieList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieListMovies" ADD CONSTRAINT "_MovieListMovies_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieListMovies" ADD CONSTRAINT "_MovieListMovies_B_fkey" FOREIGN KEY ("B") REFERENCES "MovieList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CREATE VIEW: İzlenen filmlerle ilgili detaylı bilgileri gösteren view
CREATE VIEW vw_MovieWatchDetails AS
SELECT 
    mw.id,
    u.name as user_name,
    m.title,
    m.releaseYear,
    m.director,
    STRING_AGG(g.name, ', ') as genres,
    mw.rating,
    mw.createdAt as watched_date
FROM MovieWatchedList mw
JOIN "User" u ON mw.userId = u.id
JOIN Movie m ON mw.movieId = m.id
LEFT JOIN "_MovieGenres" mg ON m.id = mg.B
LEFT JOIN Genre g ON mg.A = g.id
GROUP BY mw.id, u.name, m.title, m.releaseYear, m.director, mw.rating, mw.createdAt;

-- CREATE STORED PROCEDURE: Film izleme listesine film ekleme
CREATE OR REPLACE PROCEDURE sp_AddMovieToWatchedList(
    p_userId TEXT,
    p_movieId INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO MovieWatchedList (
        id, userId, movieId, title, releaseYear, posterUrl, 
        rating, director, duration, overview
    )
    SELECT 
        gen_random_uuid()::TEXT,
        p_userId,
        m.id,
        m.title,
        m.releaseYear,
        m.posterUrl,
        m.rating,
        m.director,
        m.duration,
        m.overview
    FROM Movie m
    WHERE m.id = p_movieId;
END;
$$;

-- CREATE FUNCTION: Kullanıcının ortalama film değerlendirmesini hesaplama
CREATE OR REPLACE FUNCTION fn_CalculateUserAverageRating(p_userId TEXT)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
    v_average DECIMAL;
BEGIN
    SELECT AVG(rating)
    INTO v_average
    FROM MovieWatchedList
    WHERE userId = p_userId
    AND rating IS NOT NULL;
    
    RETURN COALESCE(v_average, 0);
END;
$$;

-- CREATE TRIGGER FUNCTION: Film güncelleme timestamp fonksiyonu
CREATE OR REPLACE FUNCTION trg_UpdateMovieTimestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER: Film güncellendiğinde timestamp güncelleme
CREATE TRIGGER tr_MovieUpdateTimestamp
    BEFORE UPDATE ON Movie
    FOR EACH ROW
    EXECUTE FUNCTION trg_UpdateMovieTimestamp();