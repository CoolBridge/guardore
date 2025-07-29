-- Add new fields to existing profiles table for GuardORE security platform
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'community_member',
ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_rewards DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update the trigger function to handle new user registration with display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', 'community_member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;