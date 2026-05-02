import { memo } from 'react'
import './MovieCard.css'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ movie, onClick }) {
  const { id, title, poster_path, vote_average, release_date, genre_ids } = movie
  const year = release_date ? release_date.slice(0, 4) : 'N/A'
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A'

  const ratingClass =
    vote_average >= 7.5 ? 'rating-high' :
    vote_average >= 6 ? 'rating-mid' : 'rating-low'

  return (
    <article className="movie-card" onClick={() => onClick(id)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(id)}>
      <div className="card-poster">
        {poster_path ? (
          <img
            src={`${IMG_BASE}${poster_path}`}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="no-poster">🎬<span>No Image</span></div>
        )}
        <div className={`card-rating ${ratingClass}`}>⭐ {rating}</div>
        <div className="card-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <span className="card-year">{year}</span>
      </div>
    </article>
  )
}

export default memo(MovieCard);
