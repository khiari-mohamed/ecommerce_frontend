export interface NewsletterSubscriber {
  _id: string; // MongoDB ObjectId as string
  id: string; // Custom string id (optional, but present in your data)
  email: string;
  created_at: string; // ISO or formatted date string
  updated_at: string; // ISO or formatted date string
}