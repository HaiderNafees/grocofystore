
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
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif mb-6 sm:mb-8 text-center">
          Popular Categories
        </h2>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="block md:hidden">
        <ScrollArea className="w-full">
          <div className="flex space-x-3 sm:space-x-4 px-4 sm:px-6 py-4 sm:py-6">
            {categories.map((category) => {
              const image = PlaceHolderImages.find(
                (img) => img.id === category.imageId
              );
              return (
                <Link
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  key={category.name}
                  className="flex flex-col items-center gap-2 flex-shrink-0 w-20 sm:w-24"
                >
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-primary transition-all duration-300">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center whitespace-normal max-w-[80px]">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      
      {/* Tablet: 3-column grid */}
      <div className="hidden md:block lg:hidden container px-6">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 justify-center max-w-2xl mx-auto">
          {categories.map((category) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === category.imageId
            );
            return (
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group flex flex-col items-center gap-2 sm:gap-3"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-all duration-300">
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
                <span className="text-xs sm:text-sm font-medium text-center whitespace-normal">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Desktop: 4-column grid */}
      <div className="hidden lg:block container px-8">
        <div className="grid grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-8 justify-center max-w-4xl lg:max-w-5xl mx-auto">
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
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-all duration-300">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                <span className="text-sm sm:text-base font-medium text-center whitespace-normal">
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
