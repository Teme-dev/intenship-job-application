import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applicationAPI } from '../../utils/api';
import { getCompanyName, getApplicationDate, getCoverLetter } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { CheckCircle, XCircle, Clock, Calendar, Briefcase } from 'lucide-react';

const AppliedJobs = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationAPI.getStudentApplications(user.id);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'accepted':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Accepted',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'Rejected',
        };
      default:
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Pending',
        };
    }
  };

  const filteredApplications =
    filter === 'all'
      ? applications
      : applications.filter((app) => app.status === filter);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Applications</h1>
            <p className="text-gray-600">Track the status of your job applications</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({applications.filter((app) => app.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('accepted')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'accepted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted ({applications.filter((app) => app.status === 'accepted').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'rejected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({applications.filter((app) => app.status === 'rejected').length})
              </button>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? "You haven't applied to any jobs yet"
                  : `No ${filter} applications`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const statusConfig = getStatusConfig(application.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={application.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {application.job.title}
                        </h3>
                        <p className="text-blue-600 font-semibold mb-2">
                          {getCompanyName(application.job.company)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {application.job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied on {getApplicationDate(application)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bgColor}`}
                      >
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className={`font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                      <p className="text-gray-600 text-sm">{getCoverLetter(application)}</p>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Location: {application.job.location}</span>
                        <span>Salary: {application.job.salary}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;
