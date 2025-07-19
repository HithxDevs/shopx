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
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: body.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Prepare update data with proper type conversion
    const updateData: Partial<{
      name: string;
      slug: string;
      description: string;
      price: number;
      salePrice: number | null;
      stock: number;
      imageUrls: string[];
      isActive: boolean;
      isFeatured: boolean;
      category: string | null;
      tags: string[];
    }> = {};

    // Only include fields that are actually being updated
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    
    if (body.price !== undefined) {
      const price = parseFloat(body.price);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Price must be a valid positive number' },
          { status: 400 }
        );
      }
      updateData.price = price;
    }
    
    if (body.salePrice !== undefined) {
      if (body.salePrice === null || body.salePrice === '') {
        updateData.salePrice = null;
      } else {
        const salePrice = parseFloat(body.salePrice);
        if (isNaN(salePrice) || salePrice < 0) {
          return NextResponse.json(
            { error: 'Sale price must be a valid positive number or empty' },
            { status: 400 }
          );
        }
        updateData.salePrice = salePrice;
      }
    }
    
    if (body.stock !== undefined) {
      const stock = parseInt(body.stock);
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a valid positive integer' },
          { status: 400 }
        );
      }
      updateData.stock = stock;
    }
    
    if (body.imageUrls !== undefined) updateData.imageUrls = body.imageUrls;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // Validate sale price is less than regular price if both are provided
    if (updateData.salePrice !== null && updateData.salePrice !== undefined && 
        updateData.price !== undefined && updateData.salePrice >= updateData.price) {
      return NextResponse.json(
        { error: 'Sale price must be less than regular price' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: body.id },
      data: updateData
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the product' },
      { status: 500 }
    );
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