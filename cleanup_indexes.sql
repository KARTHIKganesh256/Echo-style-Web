-- Quick Cleanup Script
-- Run this FIRST before running ecommerce_database_schema.sql

-- Drop all existing indexes
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_season;
DROP INDEX IF EXISTS idx_products_active;
DROP INDEX IF EXISTS idx_products_featured;
DROP INDEX IF EXISTS idx_products_created;
DROP INDEX IF EXISTS idx_orders_user;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created;
DROP INDEX IF EXISTS idx_orders_number;
DROP INDEX IF EXISTS idx_cart_user;
DROP INDEX IF EXISTS idx_reviews_product;
DROP INDEX IF EXISTS idx_reviews_user;
DROP INDEX IF EXISTS idx_reviews_approved;
DROP INDEX IF EXISTS idx_wishlist_user;

-- Now you can run ecommerce_database_schema.sql successfully!
SELECT 'Cleanup complete! Now run your main schema file.' AS message;

