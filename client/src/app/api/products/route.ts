import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, sellers } from '@/lib/db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const excludeId = searchParams.get('exclude');

    // Build the query based on filters
    let allProducts;
    
    if (category) {
      allProducts = await db
        .select({
          id: products.id,
          sellerId: products.sellerId,
          name: products.name,
          description: products.description,
          price: products.price,
          offerPrice: products.offerPrice,
          quantity: products.quantity,
          category: products.category,
          brand: products.brand,
          sku: products.sku,
          status: products.status,
          weight: products.weight,
          dimensions: products.dimensions,
          tags: products.tags,
          images: products.images,
          googleMapsUrl: products.googleMapsUrl,
          latitude: products.latitude,
          longitude: products.longitude,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          sellerName: sellers.shopOwnerName,
          sellerShopName: sellers.shopName,
          sellerAddress: sellers.address,
          sellerCity: sellers.city,
          sellerState: sellers.state,
        })
        .from(products)
        .leftJoin(sellers, eq(products.sellerId, sellers.id))
        .where(
          excludeId 
            ? and(eq(products.status, 'active'), eq(products.category, category), ne(products.id, excludeId))
            : and(eq(products.status, 'active'), eq(products.category, category))
        )
        .limit(limit);
    } else {
      allProducts = await db
        .select({
          id: products.id,
          sellerId: products.sellerId,
          name: products.name,
          description: products.description,
          price: products.price,
          offerPrice: products.offerPrice,
          quantity: products.quantity,
          category: products.category,
          brand: products.brand,
          sku: products.sku,
          status: products.status,
          weight: products.weight,
          dimensions: products.dimensions,
          tags: products.tags,
          images: products.images,
          googleMapsUrl: products.googleMapsUrl,
          latitude: products.latitude,
          longitude: products.longitude,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          sellerName: sellers.shopOwnerName,
          sellerShopName: sellers.shopName,
          sellerAddress: sellers.address,
          sellerCity: sellers.city,
          sellerState: sellers.state,
        })
        .from(products)
        .leftJoin(sellers, eq(products.sellerId, sellers.id))
        .where(eq(products.status, 'active'))
        .limit(limit);
    }

    // Transform products
    const transformedProducts = allProducts.map((product) => ({
      id: product.id,
      sellerId: product.sellerId,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price),
      offerPrice: parseFloat(product.offerPrice),
      quantity: product.quantity,
      category: product.category || '',
      brand: product.brand || '',
      sku: product.sku || '',
      status: product.status,
      weight: product.weight ? parseFloat(product.weight) : undefined,
      dimensions: product.dimensions || '',
      tags: product.tags || [],
      images: product.images || [],
      googleMapsUrl: product.googleMapsUrl || '',
      latitude: product.latitude ? parseFloat(product.latitude) : undefined,
      longitude: product.longitude ? parseFloat(product.longitude) : undefined,
      createdAt: product.createdAt?.toISOString?.() || product.createdAt,
      updatedAt: product.updatedAt?.toISOString?.() || product.updatedAt,
      sellerName: product.sellerName || 'Unknown Seller',
      sellerShopName: product.sellerShopName || '',
      sellerAddress: product.sellerAddress || '',
      sellerCity: product.sellerCity || '',
      sellerState: product.sellerState || '',
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
