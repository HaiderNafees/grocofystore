import { products, bestSellers } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Separator } from '@/components/ui/separator';

export default function ProductPage({ params }: { params: { id: string } }) {
  const allProducts = [...products, ...bestSellers];
  const product = allProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative aspect-square bg-gray-100 rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            data-ai-hint={product.imageHint}
          />
           {product.isNew && (
            <div className="absolute top-4 left-4 bg-white text-black px-2 py-1 rounded-md text-xs font-semibold">NEW</div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold mt-4">Rs. {product.price.toLocaleString()}</p>
          
          <Separator className="my-6" />

          <div className="prose text-muted-foreground">
            <p>This is a placeholder description for {product.name}. More details about the product, its features, and specifications would go here. We are working on adding more descriptive content for our products soon.</p>
          </div>
          
          <div className="mt-8">
            <Button size="lg" className="w-full md:w-auto rounded-none uppercase tracking-wider">
              Add to Cart
            </Button>
          </div>

          {product.soldOut && (
            <div className="mt-4 text-destructive font-semibold">
                This product is currently sold out.
            </div>
           )}
        </div>
      </div>

        {relatedProducts.length > 0 && (
            <div className="mt-24">
                <h2 className="text-2xl font-semibold tracking-wide mb-8">You might also like</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                    {relatedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
