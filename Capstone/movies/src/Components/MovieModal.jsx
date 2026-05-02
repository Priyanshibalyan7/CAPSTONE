import { useEffect } from 'react'
import './MovieModal.css'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

export default function MovieModal({ movie, status, onClose }) {
  
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (status === 'loading') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box loading-box" onClick={e => e.stopPropagation()}>
          <div className="modal-spinner">🎬 Loading...</div>
        </div>
      </div>
    )
  }

  if (!movie) return null

  const {
    title, overview, vote_average, vote_count, release_date,
    runtime, genres, poster_path, backdrop_path,
    budget, revenue, original_language, tagline, cast, trailer, homepage,
  } = movie

  const rating = vote_average ? vote_average.toFixed(1) : 'N/A'
  const year = release_date ? release_date.slice(0, 4) : ''
  const ratingClass =
    vote_average >= 7.5 ? 'rating-high' :
    vote_average >= 6 ? 'rating-mid' : 'rating-low'

  const fmt = (n) => n > 0 ? `$${(n / 1_000_000).toFixed(1)}M` : 'N/A'

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Backdrop */}
        {backdrop_path && (
          <div className="modal-backdrop">
            <img src={`${BACKDROP_BASE}${backdrop_path}`} alt="" />
            <div className="backdrop-fade" />
          </div>
        )}

        
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-content">
          
          <div className="modal-poster">
            {poster_path ? (
              <img src={`${IMG_BASE}${poster_path}`} alt={title} />
            ) : (
              <div className="no-poster-lg">🎬</div>
            )}
          </div>

          
          <div className="modal-info">
            <h2 className="modal-title">{title}</h2>
            {tagline && <p className="modal-tagline">"{tagline}"</p>}

            <div className="modal-meta">
              <span className={`meta-rating ${ratingClass}`}>⭐ {rating}</span>
              <span className="meta-pill">{year}</span>
              {runtime > 0 && <span className="meta-pill">{Math.floor(runtime / 60)}h {runtime % 60}m</span>}
              <span className="meta-pill">{original_language?.toUpperCase()}</span>
            </div>

            {genres?.length > 0 && (
              <div className="modal-genres">
                {genres.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            )}

            <p className="modal-overview">{overview || 'No description available.'}</p>

            <div className="modal-stats">
              <div className="stat">
                <span className="stat-label">Votes</span>
                <span className="stat-value">{vote_count?.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Budget</span>
                <span className="stat-value">{fmt(budget)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">{fmt(revenue)}</span>
              </div>
            </div>

          
            {cast?.length > 0 && (
              <div className="modal-cast">
                <h4>Cast</h4>
                <div className="cast-grid">
                  {cast.map(actor => (
                    <div key={actor.id} className="cast-item">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                        />
                      ) : (
                        <div className="cast-placeholder">👤</div>
                      )}
                      <span className="cast-name">{actor.name}</span>
                      <span className="cast-char">{actor.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

           
            <div className="modal-actions">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-trailer"
                >
                  ▶ Watch Trailer
                </a>
              )}
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-site"
                >
                  🌐 Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
