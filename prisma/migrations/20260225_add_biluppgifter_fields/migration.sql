-- AddBiluppgifterFields
-- Adds Swedish vehicle registry fields from Biluppgifter API

-- These columns already exist in the schema but may need to be added
-- if the DB was created before these were defined.
-- Run only the ALTER statements for columns that don't exist yet.

-- Check and add missing columns safely:
DO $$
BEGIN
  -- Ensure 'color' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='color') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "color" TEXT;
  END IF;

  -- Ensure 'owners' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='owners') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "owners" INTEGER DEFAULT 1;
  END IF;

  -- Ensure 'drive' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='drive') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "drive" TEXT;
  END IF;

  -- Ensure 'trans' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='trans') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "trans" TEXT;
  END IF;

  -- Ensure 'topSpeed' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='topSpeed') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "topSpeed" TEXT;
  END IF;

  -- Ensure 'consumption' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='consumption') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "consumption" TEXT;
  END IF;

  -- Ensure 'co2' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='co2') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "co2" TEXT;
  END IF;

  -- Ensure 'battery' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='battery') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "battery" TEXT;
  END IF;

  -- Ensure 'rangemi' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='rangemi') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "rangemi" TEXT;
  END IF;

  -- Ensure 'weight' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='weight') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "weight" TEXT;
  END IF;

  -- Ensure 'towCapacity' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='towCapacity') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "towCapacity" TEXT;
  END IF;

  -- Ensure 'length' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='length') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "length" TEXT;
  END IF;

  -- Ensure 'width' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='width') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "width" TEXT;
  END IF;

  -- Ensure 'height' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='height') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "height" TEXT;
  END IF;

  -- Ensure 'seats' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='seats') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "seats" INTEGER;
  END IF;

  -- Ensure 'doors' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='doors') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "doors" INTEGER;
  END IF;

  -- Ensure 'accel' column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vehicle' AND column_name='accel') THEN
    ALTER TABLE "Vehicle" ADD COLUMN "accel" TEXT;
  END IF;

END $$;
