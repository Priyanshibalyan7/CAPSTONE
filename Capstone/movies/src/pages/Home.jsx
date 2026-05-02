import { useEffect, useState, lazy, Suspense } from 'react'
import { useMovies } from '../context/MovieContext'
import MovieCard from '../components/MovieCard'
import Pagination from '../components/Pagination'
import './Home.css'

const MovieModal = lazy(() => import('../components/MovieModal'))

export default function Home() {
  const {
    movies, totalPages, currentPage, setCurrentPage,
    selectedMovie, genres, status, detailStatus,
    fetchMovies, fetchMovieDetails, fetchGenres, clearSelectedMovie,
  } = useMovies()

  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [sortBy, setSortBy] = useState('popularity.desc')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput), 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => { fetchGenres() }, [fetchGenres])

  useEffect(() => {
    fetchMovies({ query: debouncedQuery, page: currentPage, genre, sortBy })
  }, [debouncedQuery, currentPage, genre, sortBy])

  const sortOptions = [
    { value: 'popularity.desc',    label: 'Most Popular' },
    { value: 'vote_average.desc',  label: 'Highest Rated' },
    { value: 'release_date.desc',  label: 'Newest First' },
    { value: 'revenue.desc',       label: 'Highest Grossing' },
  ]

  return (
    <main className="home">
      <section className="hero">
        <p className="hero-sub">Discover your next favorite film</p>
        <h1 className="hero-title">Explore <span>Cinema</span></h1>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button className="clear-btn" onClick={() => setSearchInput('')}>✕</button>
          )}
        </div>
      </section>

      <section className="filters">
        <select value={genre} onChange={e => setGenre(e.target.value)} className="filter-select">
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {debouncedQuery && (
          <span className="result-info">
            Results for "<strong>{debouncedQuery}</strong>"
          </span>
        )}
      </section>

      {status === 'loading' && (
        <div className="loading-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="error-state">
          <span>⚠️</span>
          <p>Something went wrong. Please try again.</p>
        </div>
      )}

      {status === 'succeeded' && movies.length === 0 && (
        <div className="empty-state">
          <span>🎭</span>
          <p>No movies found. Try a different search.</p>
        </div>
      )}

      
      {status === 'succeeded' && movies.length > 0 && (
        <section className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={fetchMovieDetails} />
          ))}
        </section>
      )}

     
      {totalPages > 1 && status === 'succeeded' && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setCurrentPage(p)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      
      {(selectedMovie || detailStatus === 'loading') && (
        <Suspense fallback={<div className="modal-loading">Loading...</div>}>
          <MovieModal
            movie={selectedMovie}
            status={detailStatus}
            onClose={clearSelectedMovie}
          />
        </Suspense>
      )}
    </main>
  )
}