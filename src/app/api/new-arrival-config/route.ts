import { NextRequest, NextResponse } from 'next/server';

let configData = {
  sectionTitle: "Nouveautés",
  sectionDescription: "Découvrez nos nouveaux produits fraîchement arrivés !",
  maxDisplay: 100,
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