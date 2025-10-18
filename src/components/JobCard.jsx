import { MapPin, Briefcase, DollarSign, Calendar, Users } from 'lucide-react';
import { getCompanyName, getJobPostedDate } from '../utils/helpers';

const JobCard = ({ job, onApply, showApplicants = false }) => {
  const companyName = getCompanyName(job.company);
  const postedDate = getJobPostedDate(job);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
          <p className="text-blue-600 font-semibold">{companyName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            job.type === 'Internship'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {job.type}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm">{job.category}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Posted on {postedDate}</span>
        </div>
        {showApplicants && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{job.applicants} applicants</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
          >
            {req}
          </span>
        ))}
        {job.requirements.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            +{job.requirements.length - 3} more
          </span>
        )}
      </div>

      {onApply && (
        <button
          onClick={() => onApply(job)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;
