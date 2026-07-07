-- Add favicon_url column to tema_website table if it doesn't exist
ALTER TABLE tema_website 
ADD COLUMN IF NOT EXISTS favicon_url LONGTEXT;

-- Seed initial favicon if not exists (optional - comment out if not needed)
UPDATE tema_website 
SET favicon_url = '/favicon.svg' 
WHERE favicon_url IS NULL AND id = 1;
