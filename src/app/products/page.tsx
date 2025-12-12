'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';
import { ProductDetail } from '@/components/product-detail';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Product } from '@/lib/types';

export default function AllProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="container py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of products.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={() => handleProductView(product)}
            />
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="max-w-md p-0">
          {selectedProduct && <ProductDetail product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
