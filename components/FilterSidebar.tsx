'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function FilterSidebar({
  categories,
  currentCategory,
  minPrice,
  maxPrice,
}: {
  categories: string[];
  currentCategory?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', formData.get('minPrice') as string);
    params.set('maxPrice', formData.get('maxPrice') as string);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-72 space-y-6">
      {/* Categories Section */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h3 className="font-semibold text-gray-200 mb-3 text-lg">Categories</h3>
        <ul className="space-y-2">
          <li>
            <a
              href={`${pathname}`}
              className={`block px-3 py-2 rounded-md transition-colors ${
                !currentCategory 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              All Categories
            </a>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <a
                href={`${pathname}?${createQueryString('category', category)}`}
                className={`block px-3 py-2 rounded-md transition-colors ${
                  currentCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range Section */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h3 className="font-semibold text-gray-200 mb-3 text-lg">Price Range</h3>
        <form onSubmit={handlePriceFilter} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              defaultValue={minPrice}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="flex items-center text-gray-400">to</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              defaultValue={maxPrice}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition-colors"
          >
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* Featured Section */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h3 className="font-semibold text-gray-200 mb-3 text-lg">Featured</h3>
        <a
          href={`${pathname}?${createQueryString('featured', 'true')}`}
          className={`block px-3 py-2 rounded-md transition-colors ${
            searchParams.get('featured') === 'true'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          Featured Products
        </a>
      </div>

      {/* Clear Filters */}
      {searchParams.size > 0 && (
        <a
          href={`${pathname}`}
          className="block text-center text-blue-400 hover:text-blue-300 mt-2 transition-colors text-sm"
        >
          Clear all filters
        </a>
      )}
    </div>
  );
}