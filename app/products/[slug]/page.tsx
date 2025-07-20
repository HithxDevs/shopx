import { ProductCard } from '@/components/ProductCard';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { notFound } from 'next/navigation';
import  prisma  from '@/app/lib/prisma';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrls: string[];
  stock: number;
  isActive: boolean;
  category: string | null;
  tags: string[];
  createdAt: Date;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  imageUrls: string[];
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    // Replace with your actual data fetching logic
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(category: string | null, currentProductId: string): Promise<RelatedProduct[]> {
  if (!category) return [];
  
  try {
    // Replace with your actual data fetching logic
    return await prisma.product.findMany({
      where: { 
        category,
        isActive: true,
        NOT: { id: currentProductId }
      },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        imageUrls: true
      }
    });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
            <Image
              src={product.imageUrls[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.salePrice && (
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
              </div>
            )}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.imageUrls.map((image, index) => (
              <button
                key={index}
                className={`aspect-square bg-gray-100 rounded overflow-hidden relative transition-all`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">{product.name}</h1>
          
          {product.category && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium text-blue-600">{product.category}</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl md:text-3xl font-bold ${product.salePrice ? 'text-red-600' : 'text-gray-900'}`}>
                ${(product.salePrice || product.price).toFixed(2)}
              </span>
              {product.salePrice && (
                <span className="text-gray-500 line-through text-lg">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {product.salePrice && (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                You save ${(product.price - (product.salePrice || product.price)).toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-lg">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-lg">Product Details</h3>
            <ul className="text-sm space-y-3">
              <li className="flex">
                <span className="text-gray-500 w-28">SKU:</span>
                <span className="font-medium">{product.id}</span>
              </li>
              <li className="flex">
                <span className="text-gray-500 w-28">Availability:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </li>
              {product.tags && product.tags.length > 0 && (
                <li className="flex">
                  <span className="text-gray-500 w-28">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </li>
              )}
              <li className="flex">
                <span className="text-gray-500 w-28">Added:</span>
                <span className="font-medium text-orange-600">
                  {new Date(product.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </li>

            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}