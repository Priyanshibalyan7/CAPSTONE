import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useMovies } from './context/MovieContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'

function App() {
  const { darkMode } = useMovies()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App;