import React, { useState } from 'react';
import { postReview } from '../../services/reviews';
import StarRating from '../Common/StarRating';

interface ReviewFormProps {
  productId: string;
  userId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, userId, onReviewSubmitted }) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postReview({
        product_id: productId,
        user_id: userId,
        stars: stars.toString(),
        comment,
        publier: '1',
      });
      setComment('');
      setStars(5);
      onReviewSubmitted();
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div>
        <label>Rating:</label>
        <StarRating rating={stars} onChange={setStars} editable />
      </div>
      <div>
        <label>Comment:</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} style={{ width: '100%' }} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;