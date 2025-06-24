/**
 * Subscribe a user to the newsletter.
 * 
 * @param email The user's email address
 * @returns {Promise<{ message: string }>} The response message
 * @throws Error if the request fails
 */
export async function subscribeToNewsletter(email: string): Promise<{ message: string }> {
  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      customerName: "Valued Customer",
      customerEmail: email,
      unsubscribeLink: "https://protein.tn/unsubscribe?email=" + encodeURIComponent(email),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}