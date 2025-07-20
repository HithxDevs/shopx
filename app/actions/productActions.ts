'use server';

import prisma from '@/app/lib/prisma';

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest';
}

export async function getProducts(params: GetProductsParams) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  
  const where: any = {
    isActive: true,
  };

  if (params.category) {
    where.category = params.category;
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      where.price.gte = parseFloat(params.minPrice);
    }
    if (params.maxPrice) {
      where.price.lte = parseFloat(params.maxPrice);
    }
  }

  if (params.featured === 'true') {
    where.isFeatured = true;
  }

  let orderBy = {};
  if (params.sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (params.sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else {
    orderBy = { createdAt: 'desc' };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}