import { NextResponse } from 'next/server';
import { loadBanners, addBanner, updateBanner, deleteBanner } from '@/lib/banner-storage';

export async function GET() {
  try {
    const banners = loadBanners();
    return NextResponse.json(banners, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const banner = await request.json();
    const newBanners = addBanner(banner);
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const banner = await request.json();
    updateBanner(banner);
    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    deleteBanner(id);
    return NextResponse.json(
      { message: 'Banner deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
