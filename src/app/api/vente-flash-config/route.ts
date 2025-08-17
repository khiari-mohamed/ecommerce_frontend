import { NextRequest, NextResponse } from 'next/server';

let configData = {
  sectionTitle: "Ventes Flash",
  sectionDescription: "Profitez de nos offres exclusives avant qu'il ne soit trop tard!",
  maxDisplay: 4,
  showOnFrontend: true,
  products: []
};

export async function POST(request: NextRequest) {
  try {
    const newConfig = await request.json();
    configData = { ...configData, ...newConfig };
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(configData);
}