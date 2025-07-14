import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Helper to extract rating and review count from Google search HTML
function extractGoogleReviews(html: string) {
  // Try to find the rating and review count in the HTML
  // This is fragile and may break if Google changes their HTML
  const ratingMatch = html.match(/([0-9],[0-9]) étoiles/);
  const countMatch = html.match(/([0-9\s]+) avis/);

  let rating = null;
  let count = null;

  if (ratingMatch) {
    rating = ratingMatch[1].replace(',', '.');
  }
  if (countMatch) {
    count = countMatch[1].replace(/\s/g, '');
  }

  // Fallback: try alternative patterns (for English or other formats)
  if (!rating) {
    const altRating = html.match(/([0-9]\.[0-9])\s*stars/);
    if (altRating) rating = altRating[1];
  }
  if (!count) {
    const altCount = html.match(/([0-9,]+)\s*reviews/);
    if (altCount) count = altCount[1].replace(/,/g, '');
  }

  return { rating, count };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Google search result page for your business (fr locale)
    const url = 'https://www.google.com/search?hl=fr-US&gl=us&q=PROTEINE+TUNISIE+%E2%80%93+SOBITAS+%7C+Creatine,+Mat%C3%A9riel+de+Musculation+%26+Whey+%C3%A0+Sousse,+4000+Rue+Ribat,+Sousse+4000,+Tunisie&ludocid=5898273993463017996&lsig=AB86z5XIMsgwXx55AWagx-KZ6eHq&hl=fr&gl=US#lrd=0x1302131b30e891b1:0x51dae0f25849b20c,1';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    });
    const html = await response.text();
    const { rating, count } = extractGoogleReviews(html);
    if (rating && count) {
      res.status(200).json({ rating, count });
    } else {
      res.status(404).json({ error: 'Could not extract reviews' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Google reviews' });
  }
}
