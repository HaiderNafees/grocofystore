import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Banner } from '@/lib/types';

const DATA_FILE = join(process.cwd(), 'data', 'banners.json');

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  require('fs').mkdirSync(dataDir, { recursive: true });
}

// Initial banner data
const initialBanners: Banner[] = [
  {
    id: 'promo-main',
    title: 'Special Offers',
    subtitle: 'Amazing deals on your favorite products',
    image: '/coffee.jpg',
    imageHint: 'main promotional banner',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    backgroundColor: '#F5EBE0',
    textColor: '#000000',
    position: 'promo',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'grid-coffee',
    title: 'COFFEE ESSENTIALS FOR EVERY COFFEE LOVER',
    image: '/coffee.jpg',
    imageHint: 'coffee essentials banner',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=Drinkable',
    position: 'grid',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'grid-wedding',
    title: 'WEDDING ESSENTIALS',
    image: '/weeding.jpg',
    imageHint: 'wedding essentials banner',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=Eatables',
    position: 'grid',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'grid-shampoo',
    title: 'EXPLORE THE RANGE OF DRY SHAMPOOS',
    image: '/Customized_gifts.jpg',
    imageHint: 'shampoo range banner',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=Personal Care',
    position: 'grid',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'grid-watch',
    title: 'adidas',
    image: '/pringles-cheesy-cheese.jpg',
    imageHint: 'adidas products banner',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=Snacks',
    position: 'grid',
    isActive: true,
    sortOrder: 4
  }
];

export function loadBanners(): Banner[] {
  try {
    if (existsSync(DATA_FILE)) {
      const fileContent = readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileContent);
    }
    // If file doesn't exist, create it with initial banners
    writeFileSync(DATA_FILE, JSON.stringify(initialBanners, null, 2));
    return initialBanners;
  } catch (error) {
    console.error('Error loading banners:', error);
    return initialBanners;
  }
}

export function saveBanners(banners: Banner[]): void {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(banners, null, 2));
  } catch (error) {
    console.error('Error saving banners:', error);
    throw new Error('Failed to save banners');
  }
}

export function addBanner(banner: Banner): Banner[] {
  const banners = loadBanners();
  const newBanners = [...banners, banner];
  saveBanners(newBanners);
  return newBanners;
}

export function updateBanner(updatedBanner: Banner): Banner[] {
  const banners = loadBanners();
  const newBanners = banners.map(b => 
    b.id === updatedBanner.id ? updatedBanner : b
  );
  saveBanners(newBanners);
  return newBanners;
}

export function deleteBanner(bannerId: string): Banner[] {
  const banners = loadBanners();
  const newBanners = banners.filter(b => b.id !== bannerId);
  saveBanners(newBanners);
  return newBanners;
}

export function getBannersByPosition(position: Banner['position']): Banner[] {
  const banners = loadBanners();
  return banners
    .filter(b => b.position === position && b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
