-- Create incidents table for anonymous reporting
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_address TEXT,
  anonymous_id UUID NOT NULL DEFAULT gen_random_uuid(),
  reporter_contact TEXT, -- Optional contact for follow-up
  evidence_urls TEXT[], -- Array of uploaded evidence URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id)
);

-- Create incident types enum for consistency
CREATE TYPE public.incident_type AS ENUM (
  'theft',
  'fraud', 
  'safety_violation',
  'environmental_damage',
  'equipment_tampering',
  'unauthorized_access',
  'violence',
  'other'
);

-- Create severity levels enum
CREATE TYPE public.severity_level AS ENUM (
  'low',
  'medium', 
  'high',
  'critical'
);

-- Create status enum
CREATE TYPE public.incident_status AS ENUM (
  'pending',
  'under_review',
  'verified',
  'dismissed',
  'resolved'
);

-- Update incidents table to use enums
ALTER TABLE public.incidents 
  ALTER COLUMN incident_type TYPE incident_type USING incident_type::incident_type,
  ALTER COLUMN severity TYPE severity_level USING severity::severity_level,
  ALTER COLUMN status TYPE incident_status USING status::incident_status;

-- Enable Row Level Security
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous reporting (public read, insert)
CREATE POLICY "Anyone can view incidents" 
ON public.incidents 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can report incidents" 
ON public.incidents 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (marshals/admins) can update
CREATE POLICY "Authenticated users can update incidents" 
ON public.incidents 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create index for geospatial queries
CREATE INDEX idx_incidents_location ON public.incidents (latitude, longitude);
CREATE INDEX idx_incidents_status ON public.incidents (status);
CREATE INDEX idx_incidents_created_at ON public.incidents (created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();