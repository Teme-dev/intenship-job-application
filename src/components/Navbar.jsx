import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user || !profile) return '/';
    switch (profile.role) {
      case 'student':
        return '/student/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={getDashboardLink()} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">CareerConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {profile?.role === 'student' && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/student/jobs"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Find Jobs
                    </Link>
                    <Link
                      to="/student/applied"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Applications
                    </Link>
                  </>
                )}

                {profile?.role === 'recruiter' && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/recruiter/post-job"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Post Job
                    </Link>
                    <Link
                      to="/recruiter/jobs"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Manage Jobs
                    </Link>
                  </>
                )}

                {profile?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Users
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-4">
                  <Link
                    to={profile?.role === 'student' ? '/student/profile' : '#'}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{profile?.full_name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="border-b pb-3 mb-3">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                </div>
                {profile?.role === 'student' && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/student/jobs"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Jobs
                    </Link>
                    <Link
                      to="/student/applied"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Applications
                    </Link>
                    <Link
                      to="/student/profile"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                )}
                {profile?.role === 'recruiter' && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/recruiter/post-job"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                    <Link
                      to="/recruiter/jobs"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Jobs
                    </Link>
                  </>
                )}
                {profile?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Users
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
