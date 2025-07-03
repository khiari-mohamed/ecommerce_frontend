import React from 'react';
import { Review } from "./../../types/reviews";
import StarRating from '../Common/StarRating';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <div>Aucun avis pour l'instant.</div>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <div
          key={review._id || review.id}
          style={{ borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarRating rating={parseInt(review.stars, 10)} />
            <span style={{ fontSize: 12, color: '#888' }}>
              {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
            </span>
          </div>
          {review.comment && <div style={{ marginTop: 4 }}>{review.comment}</div>}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;