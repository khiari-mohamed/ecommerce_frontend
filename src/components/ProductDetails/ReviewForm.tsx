import React, { useState } from "react";
import { postReview } from "@/services/reviews";

interface ReviewFormProps {
  productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!rating) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    setLoading(true);
    try {
      await postReview({
        product_id: productId,
        stars: String(rating),
        comment,
        user_id: name || "Anonymous",
        publier: "1",
        // Optionally add email if your backend supports it
      });
      setSuccess("merci pour votre avis");
      setComment("");
      setName("");
      setEmail("");
      setRating(0);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Erreur lors de l'envoi de l'avis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-medium text-2xl text-dark mb-3.5">Ajouter un avis</h2>
      <p className="mb-6">Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont indiqués. *</p>
      <div className="flex items-center gap-3 mb-7.5">
        <span>Votre note*</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer ${star <= rating ? "text-[#FBB040]" : "text-gray-5"}`}
              onClick={() => setRating(star)}
              aria-label={`Note ${star}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && setRating(star)}
            >
              <svg className="fill-current" width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z" fill=""/></svg>
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
        <div className="mb-5">
          <label htmlFor="comments" className="block mb-2.5">Commentaires</label>
          <textarea
            name="comments"
            id="comments"
            rows={5}
            placeholder="votre commentaire"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            value={comment}
            onChange={e => setComment(e.target.value)}
          ></textarea>
          <span className="flex items-center justify-between mt-2.5">
            <span className="text-custom-sm text-dark-4">Maximum</span>
            <span className="text-custom-sm text-dark-4">{comment.length}/250</span>
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-7.5 mb-5.5">
          <div>
            <label htmlFor="name" className="block mb-2.5">Nom</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Votre nom"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2.5">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="votre email"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex font-medium text-white py-3 px-7 rounded-md ease-out duration-200"
          style={{background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)'}}
          disabled={loading}
        >
          {loading ? "Envoi..." : "Soumettre des avis"}
        </button>
        {success && <div className="mt-4 text-green-600 font-semibold">{success}</div>}
        {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      </div>
    </form>
  );
};

export default ReviewForm;
