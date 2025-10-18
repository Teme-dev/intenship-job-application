export const getCompanyName = (company) => {
  return typeof company === 'object' ? company?.name : company;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const getJobPostedDate = (job) => {
  return job.postedDate || formatDate(job.created_at);
};

export const getApplicationDate = (application) => {
  return application.appliedDate || formatDate(application.applied_at);
};

export const getCoverLetter = (application) => {
  return application.cover_letter || application.coverLetter;
};
