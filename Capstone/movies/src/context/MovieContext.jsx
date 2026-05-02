import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const API_KEY = '9a15ec3fe7a2014eaf836c8bfbeb47be'
const BASE_URL = 'https://api.themoviedb.org/3'

const MovieContext = createContext()

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [genres, setGenres] = useState([])
  const [status, setStatus] = useState('idle')
  const [detailStatus, setDetailStatus] = useState('idle')
  const [darkMode, setDarkMode] = useState(true)

  const fetchMovies = useCallback(async ({ query, page = 1, genre = '', sortBy = 'popularity.desc' }) => {
    setStatus('loading')
    try {
      let url
      if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      } else {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}${genre ? `&with_genres=${genre}` : ''}`
      }
      const res = await axios.get(url)
      setMovies(res.data.results)
      setTotalPages(Math.min(res.data.total_pages, 500))
      setCurrentPage(page)
      setStatus('succeeded')
    } catch (err) {
      setStatus('failed')
    }
  }, [])

  const fetchMovieDetails = useCallback(async (movieId) => {
    setDetailStatus('loading')
    try {
      const [details, credits, videos] = await Promise.all([
        axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`),
        axios.get(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`),
        axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`),
      ])
      setSelectedMovie({
        ...details.data,
        cast: credits.data.cast.slice(0, 8),
        trailer: videos.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube'),
      })
      setDetailStatus('succeeded')
    } catch {
      setDetailStatus('failed')
    }
  }, [])

  const fetchGenres = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
      setGenres(res.data.genres)
    } catch {}
  }, [])

  const clearSelectedMovie = useCallback(() => {
    setSelectedMovie(null)
    setDetailStatus('idle')
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev)
  }, [])

  return (
    <MovieContext.Provider value={{
      movies, totalPages, currentPage, setCurrentPage,
      selectedMovie, genres, status, detailStatus, darkMode,
      fetchMovies, fetchMovieDetails, fetchGenres,
      clearSelectedMovie, toggleDarkMode,
    }}>
      {children}
    </MovieContext.Provider>
  )
}

export function useMovies() {
  return useContext(MovieContext)
}