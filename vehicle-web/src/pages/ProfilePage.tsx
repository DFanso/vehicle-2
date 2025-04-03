import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await apiService.getUserProfile();
        setProfile(userData);
        setError(null);
      } catch {
        setError('Could not load profile data. Please try again later.');
        // If user context data exists, use that as fallback
        if (user) {
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">My Profile</h1>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
            {error}
          </div>
        ) : profile ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-neutral-900">Profile Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-500">Personal details and account information.</p>
              </div>
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <span className="text-xl font-medium leading-none text-blue-700">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="border-t border-neutral-200">
              <dl>
                <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500">Full name</dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    {profile.firstName} {profile.lastName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500">Email address</dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    {profile.email}
                  </dd>
                </div>
                <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500">Account status</dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfilePage; 