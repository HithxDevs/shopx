import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// Helper function to handle errors
function handleError(error: unknown, context: string) {
  console.error(`Error ${context}:`, error);
  return NextResponse.json(
    { error: `Failed to ${context}` }, 
    { status: 500 }
  );
}

// GET - Fetch all products with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active') ?? 'true';

    const where = {
      isActive: active === 'true',
      ...(category && { category }),
      ...(featured && { isFeatured: featured === 'true' })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleError(error, 'fetching products');
  }
}

// POST - Create new product with validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description || null,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        stock: parseInt(body.stock) || 0,
        imageUrls: body.imageUrls || [],
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        category: body.category || null,
        tags: body.tags || []
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleError(error, 'creating product');
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Convert numeric fields
    const updateData = {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      salePrice: body.salePrice ? parseFloat(body.salePrice) : undefined,
      stock: body.stock ? parseInt(body.stock) : undefined
    };

    const product = await prisma.product.update({
      where: { id: body.id },
      data: updateData
    });
    
    return NextResponse.json(product);
  } catch (error) {
    return handleError(error, 'updating product');
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists in any orders first
    const orderItems = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItems > 0) {
      return NextResponse.json(
        { error: 'Product cannot be deleted as it exists in orders' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, 'deleting product');
  }
}