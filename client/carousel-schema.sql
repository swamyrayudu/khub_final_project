-- Carousel Items Table Schema
-- This SQL script creates the carousel_items table for storing carousel slide data

-- Create the carousel_items table
CREATE TABLE IF NOT EXISTS carousel_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  cloudinary_public_id VARCHAR(255) DEFAULT '' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_carousel_order ON carousel_items ("order");
CREATE INDEX IF NOT EXISTS idx_carousel_active ON carousel_items (is_active);
CREATE INDEX IF NOT EXISTS idx_carousel_created_at ON carousel_items (created_at DESC);

-- Insert sample carousel data (optional - modify as needed)
INSERT INTO carousel_items (image, title, description, "order", is_active, cloudinary_public_id)
VALUES
  (
    'https://images.unsplash.com/photo-1460925895917-aae19e938282?w=1200&h=400&fit=crop&q=80',
    'Summer Collection',
    'Explore our latest summer collection with amazing discounts',
    1,
    true,
    'carousel/summer-collection'
  ),
  (
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop&q=80',
    'New Arrivals',
    'Check out our newest products this season',
    2,
    true,
    'carousel/new-arrivals'
  ),
  (
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop&q=80',
    'Flash Sale',
    'Limited time offers on selected items',
    3,
    true,
    'carousel/flash-sale'
  ),
  (
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=400&fit=crop&q=80',
    'Exclusive Deals',
    'Get exclusive deals for our members',
    4,
    true,
    'carousel/exclusive-deals'
  )
ON CONFLICT DO NOTHING;

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_carousel_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at field
DROP TRIGGER IF EXISTS carousel_update_timestamp ON carousel_items;
CREATE TRIGGER carousel_update_timestamp
BEFORE UPDATE ON carousel_items
FOR EACH ROW
EXECUTE FUNCTION update_carousel_timestamp();

-- View for active carousel items ordered by priority
CREATE OR REPLACE VIEW active_carousel_items AS
SELECT 
  id,
  image,
  title,
  description,
  "order",
  cloudinary_public_id,
  created_at,
  updated_at
FROM carousel_items
WHERE is_active = true
ORDER BY "order" ASC;

-- Sample queries for reference:
-- Get all active carousel items ordered by priority
-- SELECT * FROM active_carousel_items;

-- Get carousel items by ID
-- SELECT * FROM carousel_items WHERE id = 'your-uuid-here';

-- Update carousel item
-- UPDATE carousel_items SET title = 'New Title', description = 'New Description' WHERE id = 'your-uuid-here';

-- Soft delete (keep data but mark as inactive)
-- UPDATE carousel_items SET is_active = false WHERE id = 'your-uuid-here';

-- Hard delete
-- DELETE FROM carousel_items WHERE id = 'your-uuid-here';

-- Count active carousel items
-- SELECT COUNT(*) FROM carousel_items WHERE is_active = true;

-- Get carousel items with pagination
-- SELECT * FROM active_carousel_items LIMIT 10 OFFSET 0;
