# CareerConnect Backend Documentation

## Overview

CareerConnect uses **Supabase** as a complete backend solution providing:
- PostgreSQL database with Row Level Security (RLS)
- Authentication (email/password)
- File storage (resumes & company logos)
- Real-time capabilities
- RESTful API through Supabase client

## Database Schema

### Tables

#### 1. profiles
Extends Supabase auth.users with additional user information.

```sql
- id (uuid, primary key, references auth.users)
- role (enum: student, recruiter, admin)
- full_name (text)
- phone (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 2. student_profiles
Stores student-specific information.

```sql
- user_id (uuid, primary key, references profiles)
- education (text)
- degree (text)
- graduation_year (integer)
- skills (text[])
- resume_url (text)
- bio (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 3. companies
Stores company information for recruiters.

```sql
- id (uuid, primary key)
- name (text)
- description (text)
- website (text)
- logo_url (text)
- industry (text)
- location (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 4. recruiter_profiles
Links recruiters to companies and tracks approval status.

```sql
- user_id (uuid, primary key, references profiles)
- company_id (uuid, references companies)
- position (text)
- approved (boolean, default: false)
- approved_at (timestamptz)
- approved_by (uuid, references profiles)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 5. jobs
Stores all job and internship postings.

```sql
- id (uuid, primary key)
- title (text)
- description (text)
- requirements (text)
- category (text)
- type (enum: internship, fulltime)
- location (text)
- salary_min (integer)
- salary_max (integer)
- deadline (date)
- company_id (uuid, references companies)
- recruiter_id (uuid, references profiles)
- status (enum: active, closed, draft)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 6. applications
Tracks student applications to jobs.

```sql
- id (uuid, primary key)
- job_id (uuid, references jobs)
- student_id (uuid, references profiles)
- status (enum: pending, accepted, rejected)
- cover_letter (text)
- applied_at (timestamptz)
- updated_at (timestamptz)
- UNIQUE constraint on (job_id, student_id)
```

## Security (Row Level Security)

All tables have RLS enabled with the following policies:

### Profiles
- Users can view and update their own profile
- Admins can view all profiles

### Student Profiles
- Students can manage their own profile
- Recruiters can view profiles of applicants to their jobs

### Companies
- Anyone authenticated can view companies
- Recruiters can create and update their own company

### Recruiter Profiles
- Recruiters can manage their own profile
- Admins can view all and approve recruiters

### Jobs
- Anyone can view active jobs
- Approved recruiters can create jobs
- Recruiters can manage their own jobs
- Admins have full access

### Applications
- Students can view their own applications
- Students can apply to jobs
- Recruiters can view applications for their jobs
- Recruiters can update application status for their jobs

## Storage Buckets

### 1. resumes
- **Purpose**: Store student resume files
- **Allowed formats**: PDF, DOC, DOCX
- **Access**: Public read, authenticated students can upload
- **Path structure**: `resumes/{user_id}-{timestamp}.{ext}`

### 2. logos
- **Purpose**: Store company logo images
- **Allowed formats**: PNG, JPG, JPEG, SVG
- **Access**: Public read, authenticated recruiters can upload
- **Path structure**: `logos/{company_id}-{timestamp}.{ext}`

## API Usage

### Authentication

```javascript
import { supabase } from './lib/supabase';

// Register
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Logout
const { error } = await supabase.auth.signOut();

// Get current session
const { data: { session } } = await supabase.auth.getSession();
```

### Database Operations

```javascript
// Fetch all active jobs
const { data: jobs, error } = await supabase
  .from('jobs')
  .select(`
    *,
    company:companies(*),
    recruiter:profiles!recruiter_id(id, full_name)
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });

// Create a job
const { data, error } = await supabase
  .from('jobs')
  .insert([{
    title: 'Software Engineer Intern',
    description: 'Join our team...',
    category: 'Software Engineering',
    type: 'internship',
    location: 'San Francisco, CA',
    salary_min: 20000,
    salary_max: 35000,
    company_id: companyId,
    recruiter_id: userId,
    status: 'active',
  }])
  .select()
  .single();

// Apply for a job
const { data, error } = await supabase
  .from('applications')
  .insert([{
    job_id: jobId,
    student_id: userId,
    cover_letter: 'I am interested...',
  }])
  .select()
  .single();

// Update application status
const { data, error } = await supabase
  .from('applications')
  .update({ status: 'accepted' })
  .eq('id', applicationId);
```

### File Upload

```javascript
import { uploadFile } from './lib/supabase';

// Upload resume
const file = event.target.files[0];
const publicUrl = await uploadFile('resumes', `resumes/${userId}-${Date.now()}.pdf`, file);

// Update profile with resume URL
const { error } = await supabase
  .from('student_profiles')
  .update({ resume_url: publicUrl })
  .eq('user_id', userId);
```

## API Utilities

The application includes a comprehensive API utility layer in `src/utils/supabaseApi.js`:

- **authAPI**: Login, register, logout
- **jobAPI**: CRUD operations for jobs, filtering, searching
- **applicationAPI**: Apply to jobs, view applications, update status
- **userAPI**: Profile management, user lists, approvals
- **companyAPI**: Company CRUD, logo upload
- **statsAPI**: Dashboard statistics for all user roles

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Roles

### Student
- Register and create profile
- Search and filter jobs
- Apply for jobs
- Track application status
- Upload resume
- Update profile

### Recruiter
- Register and create profile
- Create company profile (requires admin approval)
- Post job listings (after approval)
- View applicants
- Update application status (accept/reject)
- Manage own job postings

### Admin
- View all users and jobs
- Approve/block recruiters
- Manage all content
- View statistics
- Full system access

## Data Flow

1. **Registration**: User signs up → Auth user created → Profile created → Role-specific profile created
2. **Job Application**: Student views job → Applies → Application created → Recruiter views applicants
3. **Recruiter Approval**: Recruiter registers → Admin reviews → Admin approves → Recruiter can post jobs

## Sample Data

The database includes sample companies:
- TechCorp Inc (Technology)
- InnovateLabs (Fintech)
- DataSystems Corp (Data Analytics)
- CloudNine Solutions (Cloud Services)
- MobileFirst Studios (Mobile Development)

## Notes

- All timestamps are in UTC
- Passwords are hashed by Supabase Auth
- RLS ensures data isolation between users
- File uploads are stored in Supabase Storage
- Real-time subscriptions available for all tables
- Automatic updated_at triggers on all tables

## Testing

To test the backend:

1. Register as different user types
2. Create sample jobs as recruiter
3. Apply to jobs as student
4. Use admin account to approve recruiters
5. Test file uploads (resumes, logos)
6. Verify RLS by trying to access other users' data

## Production Checklist

- [ ] Remove or update sample data migration
- [ ] Review and adjust RLS policies
- [ ] Set up proper backup schedule
- [ ] Configure email templates
- [ ] Set up monitoring and alerts
- [ ] Review storage bucket policies
- [ ] Enable database backups
- [ ] Set up proper logging
