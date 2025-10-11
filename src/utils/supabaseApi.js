import { supabase, uploadFile, deleteFile } from '../lib/supabase';

export const authAPI = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: data.user,
      profile,
      session: data.session,
    };
  },

  register: async (userData) => {
    const { email, password, ...profileData } = userData;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        role: profileData.role,
        full_name: profileData.full_name,
        phone: profileData.phone,
      }]);

    if (profileError) throw profileError;

    if (profileData.role === 'student') {
      await supabase
        .from('student_profiles')
        .insert([{
          user_id: authData.user.id,
          education: profileData.education || '',
          degree: profileData.degree || '',
          skills: profileData.skills || [],
        }]);
    } else if (profileData.role === 'recruiter') {
      await supabase
        .from('recruiter_profiles')
        .insert([{
          user_id: authData.user.id,
          position: profileData.position || '',
          approved: false,
        }]);
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

export const jobAPI = {
  getAllJobs: async (filters = {}) => {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        recruiter:profiles!recruiter_id(id, full_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;
    if (error) throw error;

    const jobsWithApplicantCount = await Promise.all(
      data.map(async (job) => {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id);

        return {
          ...job,
          applicants: count || 0,
        };
      })
    );

    return jobsWithApplicantCount;
  },

  getJobById: async (id) => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        recruiter:profiles!recruiter_id(id, full_name)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', id);

    return {
      ...data,
      applicants: count || 0,
    };
  },

  createJob: async (jobData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: recruiterProfile } = await supabase
      .from('recruiter_profiles')
      .select('company_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!recruiterProfile?.company_id) {
      throw new Error('Please create a company profile first');
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...jobData,
        recruiter_id: user.id,
        company_id: recruiterProfile.company_id,
      }])
      .select(`
        *,
        company:companies(*),
        recruiter:profiles!recruiter_id(id, full_name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  updateJob: async (id, jobData) => {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select(`
        *,
        company:companies(*),
        recruiter:profiles!recruiter_id(id, full_name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  deleteJob: async (id) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  getRecruiterJobs: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        recruiter:profiles!recruiter_id(id, full_name)
      `)
      .eq('recruiter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const jobsWithApplicantCount = await Promise.all(
      data.map(async (job) => {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id);

        return {
          ...job,
          applicants: count || 0,
        };
      })
    );

    return jobsWithApplicantCount;
  },
};

export const applicationAPI = {
  applyForJob: async (jobId, applicationData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('student_id', user.id)
      .maybeSingle();

    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        student_id: user.id,
        cover_letter: applicationData.cover_letter,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getStudentApplications: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(
          *,
          company:companies(*)
        )
      `)
      .eq('student_id', user.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getJobApplicants: async (jobId) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        student:profiles!student_id(
          id,
          full_name,
          phone
        ),
        student_profile:student_profiles!student_id(
          education,
          degree,
          graduation_year,
          skills,
          resume_url,
          bio
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    return data.map(app => ({
      ...app,
      student: {
        ...app.student,
        ...app.student_profile,
      },
    }));
  },

  updateApplicationStatus: async (applicationId, status) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const userAPI = {
  updateProfile: async (userData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: userData.full_name,
        phone: userData.phone,
      })
      .eq('id', user.id);

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile.role === 'student' && userData.student_profile) {
      const { error: studentError } = await supabase
        .from('student_profiles')
        .update(userData.student_profile)
        .eq('user_id', user.id);

      if (studentError) throw studentError;
    }

    return { success: true };
  },

  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    if (profile.role === 'student') {
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      return { ...profile, student_profile: studentProfile };
    }

    if (profile.role === 'recruiter') {
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      return { ...profile, recruiter_profile: recruiterProfile };
    }

    return profile;
  },

  updateStudentProfile: async (profileData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('student_profiles')
      .update(profileData)
      .eq('user_id', user.id);

    if (error) throw error;
    return { success: true };
  },

  uploadResume: async (file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const publicUrl = await uploadFile('resumes', filePath, file);

    const { error } = await supabase
      .from('student_profiles')
      .update({ resume_url: publicUrl })
      .eq('user_id', user.id);

    if (error) throw error;

    return publicUrl;
  },

  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  approveRecruiter: async (recruiterId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('recruiter_profiles')
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('user_id', recruiterId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  blockUser: async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ blocked: true })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  },
};

export const companyAPI = {
  createCompany: async (companyData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (companyError) throw companyError;

    const { error: recruiterError } = await supabase
      .from('recruiter_profiles')
      .update({ company_id: company.id })
      .eq('user_id', user.id);

    if (recruiterError) throw recruiterError;

    return company;
  },

  updateCompany: async (companyId, companyData) => {
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getCompany: async (companyId) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  uploadLogo: async (companyId, file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${companyId}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const publicUrl = await uploadFile('logos', filePath, file);

    const { error } = await supabase
      .from('companies')
      .update({ logo_url: publicUrl })
      .eq('id', companyId);

    if (error) throw error;

    return publicUrl;
  },
};

export const statsAPI = {
  getAdminStats: async () => {
    const [
      { count: totalStudents },
      { count: totalRecruiters },
      { count: totalJobs },
      { count: totalApplications },
      { count: pendingRecruiters },
      { count: activeJobs }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'recruiter'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('recruiter_profiles').select('*', { count: 'exact', head: true }).eq('approved', false),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    return {
      totalStudents: totalStudents || 0,
      totalRecruiters: totalRecruiters || 0,
      totalJobs: totalJobs || 0,
      totalApplications: totalApplications || 0,
      pendingRecruiters: pendingRecruiters || 0,
      activeJobs: activeJobs || 0,
    };
  },

  getRecruiterStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const [
      { count: totalJobs },
      { count: activeJobs },
      { count: totalApplications }
    ] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('recruiter_id', user.id),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('recruiter_id', user.id).eq('status', 'active'),
      supabase
        .from('applications')
        .select('job_id', { count: 'exact', head: true })
        .in('job_id',
          supabase.from('jobs').select('id').eq('recruiter_id', user.id)
        ),
    ]);

    return {
      totalJobs: totalJobs || 0,
      activeJobs: activeJobs || 0,
      totalApplications: totalApplications || 0,
    };
  },

  getStudentStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const [
      { count: totalApplications },
      { count: pendingApplications },
      { count: acceptedApplications },
      { count: rejectedApplications }
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('student_id', user.id),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'pending'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'accepted'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'rejected'),
    ]);

    return {
      totalApplications: totalApplications || 0,
      pendingApplications: pendingApplications || 0,
      acceptedApplications: acceptedApplications || 0,
      rejectedApplications: rejectedApplications || 0,
    };
  },
};
