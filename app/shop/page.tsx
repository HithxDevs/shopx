import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Pagination } from '@/components/Pagination';
// import { SortDropdown } from '@/components/SortDropdown';
import prisma from '@/app/lib/prisma';

// Types
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

interface ProductsData {
  products: Product[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    search?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

// Data fetching functions
async function getProducts(filters: {
  page: number;
  limit: number;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  sort: 'price-asc' | 'price-desc' | 'newest' | 'oldest';
  search?: string;
}): Promise<ProductsData> {
  try {
    const { page, limit, category, minPrice, maxPrice, featured, sort, search } = filters;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.OR = [
        {
          AND: [
            minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
            maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
          ]
        },
        {
          AND: [
            minPrice ? { salePrice: { gte: parseFloat(minPrice) } } : {},
            maxPrice ? { salePrice: { lte: parseFloat(maxPrice) } } : {},
          ]
        }
      ];
    }

    if (featured === 'true') {
      where.salePrice = { not: null };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case 'price-asc':
        orderBy = [
          { salePrice: { sort: 'asc', nulls: 'last' } },
          { price: 'asc' }
        ];
        break;
      case 'price-desc':
        orderBy = [
          { salePrice: { sort: 'desc', nulls: 'last' } },
          { price: 'desc' }
        ];
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        total,
        pages,
        current: page,
        hasNext: page < pages,
        hasPrev: page > 1,
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: {
        total: 0,
        pages: 0,
        current: 1,
        hasNext: false,
        hasPrev: false,
      }
    };
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const categories = await prisma.product.findMany({
      where: { 
        isActive: true,
        category: { not: null }
      },
      select: { category: true },
      distinct: ['category']
    });

    return categories
      .map(item => item.category)
      .filter((category): category is string => category !== null);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Main component
export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await searchParams before using its properties
  const resolvedSearchParams = await searchParams;
  
  // Extract and set defaults for search parameters
  const page = resolvedSearchParams.page || '1';
  const limit = resolvedSearchParams.limit || '12';
  const sort = resolvedSearchParams.sort || 'newest';
  const search = resolvedSearchParams.search;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 12;

  // Fetch data with resolved search params
  const productsData = await getProducts({
    page: pageNumber,
    limit: limitNumber,
    category: resolvedSearchParams.category,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    featured: resolvedSearchParams.featured,
    sort: sort as 'price-asc' | 'price-desc' | 'newest' | 'oldest',
    search: search,
  });

  const { products, pagination } = productsData;
  const categories = await getCategories();
  const cleanCategories = categories.filter(cat => cat !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Discover our amazing product collection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <FilterSidebar 
                categories={cleanCategories}
                currentCategory={resolvedSearchParams.category}
                minPrice={resolvedSearchParams.minPrice}
                maxPrice={resolvedSearchParams.maxPrice}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl text-black font-bold">
                  {resolvedSearchParams.category 
                    ? `${resolvedSearchParams.category} Products` 
                    : resolvedSearchParams.featured === 'true'
                    ? 'Featured Products'
                    : search
                    ? `Search Results for "${search}"`
                    : 'All Products'
                  }
                  <span className="text-gray-400 text-lg ml-2">
                    ({pagination.total} items)
                  </span>
                </h2>
                {resolvedSearchParams.category && (
                  <p className="text-gray-600 mt-1">
                    Browse our {resolvedSearchParams.category.toLowerCase()} collection
                  </p>
                )}
              </div>

              
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center">
                    <Pagination 
                      currentPage={pagination.current}
                      totalPages={pagination.pages}
                    />
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V8a2 2 0 00-2-2h-3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    {search 
                      ? `No products match your search "${search}"`
                      : resolvedSearchParams.category
                      ? `No products found in the ${resolvedSearchParams.category} category`
                      : 'Try adjusting your filters or check back later'
                    }
                  </p>
                  <a 
                    href="/shop" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ searchParams }: { 
  searchParams: Promise<{ 
    category?: string; 
    search?: string;
    featured?: string;
    [key: string]: string | string[] | undefined;
  }> 
}) {
  const resolvedSearchParams = await searchParams;
  
  let title = 'Shop';
  let description = 'Browse our amazing product collection';

  if (resolvedSearchParams.category) {
    title = `${resolvedSearchParams.category} - Shop`;
    description = `Browse our ${resolvedSearchParams.category.toLowerCase()} products`;
  } else if (resolvedSearchParams.search) {
    title = `Search: ${resolvedSearchParams.search} - Shop`;
    description = `Search results for "${resolvedSearchParams.search}"`;
  } else if (resolvedSearchParams.featured === 'true') {
    title = 'Featured Products - Shop';
    description = 'Browse our featured and sale products';
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}