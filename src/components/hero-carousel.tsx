"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

const heroImages = PlaceHolderImages.filter(img => img.id.startsWith("hero-"));

export function HeroCarousel() {
  return (
    <section className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-0 hero-aspect-desktop hero-aspect-mobile">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 bg-black/20">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="absolute bottom-[10%] left-1/2 -translate-x-1/2 rounded-md font-semibold"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
