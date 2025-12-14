
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

const categories = [
  { name: 'Eatables', imageId: 'category-eatables' },
  { name: 'Snacks', imageId: 'category-snacks' },
  { name: 'Biscuits', imageId: 'category-biscuits' },
  { name: 'Drinkable', imageId: 'category-drinkable' },
  { name: 'Dairy', imageId: 'category-dairy' },
  { name: 'Personal Care', imageId: 'category-personal' },
  { name: 'Household', imageId: 'category-household' },
  { name: 'Baby Care', imageId: 'category-baby' },
];

export function PopularCategories() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-serif mb-8 text-center">
          Popular Categories
        </h2>
      </div>

      {/* Mobile: Horizontal scroll grid like reference image */}
      <div className="block lg:hidden">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 px-4 py-6">
            {categories.map((category) => {
              const image = PlaceHolderImages.find(
                (img) => img.id === category.imageId
              );
              return (
                <Link
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  key={category.name}
                  className="flex flex-col items-center gap-2 flex-shrink-0 w-24"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-primary transition-all duration-300">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center whitespace-normal">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      
      {/* Desktop: Centered grid */}
      <div className="hidden lg:block container">
        <div className="grid grid-cols-4 gap-x-8 gap-y-8 px-12 justify-center max-w-4xl mx-auto">
          {categories.map((category) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === category.imageId
            );
            return (
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group flex flex-col items-center gap-3"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-all duration-300">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 40vw, 20vw"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-center whitespace-normal">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
