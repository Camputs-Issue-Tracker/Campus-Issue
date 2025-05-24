-- First check if the column doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Post' 
        AND column_name = 'status'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE "Post" ADD COLUMN "status" TEXT DEFAULT 'pending';
        
        -- Update any null values to 'pending'
        UPDATE "Post" SET "status" = 'pending' WHERE "status" IS NULL;
    END IF;
END $$;
