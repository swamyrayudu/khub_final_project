import { sql } from 'drizzle-orm';
import { db } from '.';

let initialized = false;

export async function ensureCarouselTableExists() {
  if (initialized) return;
  
  try {
    // Check if table exists
    await db.execute(sql`SELECT 1 FROM carousel_items LIMIT 1`);
    initialized = true;
  } catch {
    // Table doesn't exist, create it
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

        CREATE INDEX IF NOT EXISTS idx_carousel_order ON carousel_items ("order");
        CREATE INDEX IF NOT EXISTS idx_carousel_active ON carousel_items (is_active);
      `);

      // Seed default items
      await db.execute(sql`
        INSERT INTO carousel_items (image, title, description, "order", is_active)
        VALUES
          ('https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop&q=80', 'Discover Local Products', 'Shop from verified local sellers near you', 1, true),
          ('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=400&fit=crop&q=80', 'Best Deals Everyday', 'Find amazing discounts on thousands of products', 2, true),
          ('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop&q=80', 'Fast & Reliable Service', 'Get your products quickly from local stores', 3, true),
          ('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop&q=80', 'Support Local Business', 'Help small businesses grow in your community', 4, true)
        ON CONFLICT DO NOTHING
      `);

      console.log('✅ Carousel table created and seeded');
      initialized = true;
    } catch (createError) {
      console.error('❌ Error creating carousel table:', createError);
    }
  }
}
