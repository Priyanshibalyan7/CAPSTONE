import { useMovies } from '../context/MovieContext'
import './Navbar.css'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useMovies()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🎬</span>
        <span className="brand-text">CineVerse</span>
      </div>
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '🌅' : '🌑'}
        <span>{darkMode ? 'Light' : 'Dark'}</span>
      </button>
    </nav>
  )
}