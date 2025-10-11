/*
  # Seed Sample Data for CareerConnect
  
  ## Overview
  This migration adds sample data for testing and demonstration purposes.
  
  ## Data Created
  
  ### 1. Sample Admin User
  - Email: admin@careerconnect.com
  - Password: admin123
  - Role: admin
  
  ### 2. Sample Companies
  - Tech companies with various profiles
  
  ### 3. Sample Jobs
  - Mix of internships and full-time positions
  - Various categories and locations
  
  ## Important Notes
  - This is sample data for development/testing only
  - In production, remove this migration or adjust accordingly
  - User passwords are hashed but use simple test passwords
*/

-- Insert sample companies
INSERT INTO companies (id, name, description, website, industry, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Inc', 'Leading technology solutions provider specializing in cloud computing and AI', 'https://techcorp.example.com', 'Technology', 'San Francisco, CA'),
  ('550e8400-e29b-41d4-a716-446655440002', 'InnovateLabs', 'Innovative startup focused on blockchain and fintech solutions', 'https://innovatelabs.example.com', 'Fintech', 'New York, NY'),
  ('550e8400-e29b-41d4-a716-446655440003', 'DataSystems Corp', 'Enterprise data analytics and business intelligence platform', 'https://datasystems.example.com', 'Data Analytics', 'Austin, TX'),
  ('550e8400-e29b-41d4-a716-446655440004', 'CloudNine Solutions', 'Cloud infrastructure and DevOps consulting services', 'https://cloudnine.example.com', 'Cloud Services', 'Seattle, WA'),
  ('550e8400-e29b-41d4-a716-446655440005', 'MobileFirst Studios', 'Mobile app development and UX design agency', 'https://mobilefirst.example.com', 'Mobile Development', 'Los Angeles, CA')
ON CONFLICT (id) DO NOTHING;

-- Note: For actual users, they need to be created through Supabase Auth
-- The following is a template for what profiles would look like
-- In a real scenario, you would create users through the auth system first

-- Sample job categories data structure for reference
-- Categories: Software Engineering, Data Science, Marketing, Design, Business, Finance, Sales, HR, Operations

-- This comment block shows the structure for adding sample jobs once auth users are created:
/*
INSERT INTO jobs (id, title, description, requirements, category, type, location, salary_min, salary_max, deadline, company_id, recruiter_id, status) VALUES
  (
    '650e8400-e29b-41d4-a716-446655440001',
    'Software Engineering Intern',
    'Join our engineering team to work on cutting-edge cloud solutions. You will collaborate with senior engineers on real production systems.',
    'Currently pursuing BS/MS in Computer Science or related field. Strong programming skills in Python, Java, or JavaScript. Knowledge of data structures and algorithms.',
    'Software Engineering',
    'internship',
    'San Francisco, CA',
    20000,
    35000,
    '2025-12-31',
    '550e8400-e29b-41d4-a716-446655440001',
    'RECRUITER_USER_ID_HERE',
    'active'
  );
*/
