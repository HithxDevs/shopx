import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Pagination } from '@/components/Pagination';
import { getProducts } from '@/app/actions/productActions';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    sort?: string;
  };
}) {
  const page = searchParams.page || '1';
  const limit = searchParams.limit || '12';
  const sort = searchParams.sort || 'newest';

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 12;

  const { data: products, pagination } = await getProducts({
    page: pageNumber,
    limit: limitNumber,
    category: searchParams.category,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    featured: searchParams.featured,
    sort: sort as 'price-asc' | 'price-desc' | 'newest',
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    where: { isActive: true },
    distinct: ['category'],
  });

  const cleanCategories = categories
    .map(c => c.category)
    .filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white text-black-100">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Collection</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover premium products curated just for you
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72">
            <FilterSidebar 
              categories={cleanCategories}
              currentCategory={searchParams.category}
              minPrice={searchParams.minPrice}
              maxPrice={searchParams.maxPrice}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl text-black font-bold">
                {searchParams.category ? `${searchParams.category} Products` : 'All Products'}
                <span className="text-gray-400 text-lg ml-2">
                  ({pagination.total} items)
                </span>
              </h2>
              
              <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-2">
                <label htmlFor="sort" className="text-sm text-gray-300">Sort by:</label>
                <select 
                  id="sort" 
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={sort}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-lg">
                <p className="text-xl text-gray-400">No products found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination 
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}