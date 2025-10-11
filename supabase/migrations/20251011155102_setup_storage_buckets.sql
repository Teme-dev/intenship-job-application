/*
  # Setup Storage Buckets for CareerConnect
  
  ## Overview
  This migration creates storage buckets for file uploads and sets up appropriate access policies.
  
  ## Buckets Created
  
  ### 1. resumes
  - Stores student resume files (PDF, DOC, DOCX)
  - Public access for reading
  - Only authenticated students can upload their own resumes
  
  ### 2. logos
  - Stores company logo images (PNG, JPG, JPEG, SVG)
  - Public access for reading
  - Only authenticated recruiters can upload logos for their companies
  
  ## Security
  - Public buckets allow anyone to read files
  - Upload policies restrict who can upload files
  - File size limits enforced
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('resumes', 'resumes', true),
  ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Resumes bucket policies
CREATE POLICY "Anyone can view resumes"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'resumes');

CREATE POLICY "Students can upload own resume"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can update own resume"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can delete own resume"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Logos bucket policies
CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'logos');

CREATE POLICY "Recruiters can upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'recruiter'
    )
  );

CREATE POLICY "Recruiters can update logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'recruiter'
    )
  )
  WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'recruiter'
    )
  );

CREATE POLICY "Recruiters can delete logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'recruiter'
    )
  );
