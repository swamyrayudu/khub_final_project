import { sql } from 'drizzle-orm';
import { db } from '.';

export async function createCarouselTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS carousel_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        "order" INTEGER DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        cloudinary_public_id VARCHAR(255) DEFAULT '' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Create index for sorting by order
      CREATE INDEX IF NOT EXISTS idx_carousel_order ON carousel_items ("order");
      
      -- Create index for active items
      CREATE INDEX IF NOT EXISTS idx_carousel_active ON carousel_items (is_active);
    `);

    console.log('✅ Carousel table created successfully');
  } catch (error) {
    console.error('❌ Error creating carousel table:', error);
    throw error;
  }
}

// Insert default carousel items if table is empty
export async function seedCarouselItems() {
  try {
    const count = await db.execute(sql`SELECT COUNT(*) as count FROM carousel_items WHERE is_active = true`);
    
    if (count.length === 0 || (count[0] as Record<string, number>).count === 0) {
      await db.execute(sql`
        INSERT INTO carousel_items (image, title, description, "order", is_active)
        VALUES
          ('https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop', 'Discover Local Products', 'Shop from verified local sellers near you', 1, true),
          ('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=400&fit=crop', 'Best Deals Everyday', 'Find amazing discounts on thousands of products', 2, true),
          ('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop', 'Fast & Reliable Service', 'Get your products quickly from local stores', 3, true),
          ('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop&q=80', 'Support Local Business', 'Help small businesses grow in your community', 4, true)
      `);
      
      console.log('✅ Default carousel items seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding carousel items:', error);
    // Don't throw - this is optional
  }
}
