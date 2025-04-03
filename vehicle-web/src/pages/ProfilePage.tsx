import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('profile');

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
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header */}
        <div className="relative mb-12">
          {/* Background Cover */}
          <div className="h-48 w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1500">
                <rect fill="none" width="2000" height="1500"/>
                <defs>
                  <radialGradient id="a" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#FB923C"/>
                    <stop offset="1" stopColor="#F97316"/>
                  </radialGradient>
                  <linearGradient id="b" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F97316" stopOpacity=".5"/>
                    <stop offset="1" stopColor="#C2410C" stopOpacity=".5"/>
                  </linearGradient>
                </defs>
                <path fill="url(#a)" d="M0 0h2000v1500H0z"/>
                <g fill="url(#b)">
                  <circle cx="500" cy="300" r="300"/>
                  <circle cx="1500" cy="500" r="250"/>
                  <circle cx="1000" cy="1000" r="500"/>
                </g>
              </svg>
            </div>
          </div>
          
          {/* Profile Info Card */}
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/3">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="h-32 w-32 flex-shrink-0 rounded-full bg-primary-light flex items-center justify-center border-4 border-white shadow">
                  {profile && (
                    <span className="text-4xl font-bold text-primary-dark">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {loading ? (
                    <div className="animate-pulse flex flex-col gap-2">
                      <div className="h-7 bg-neutral-200 rounded w-1/3"></div>
                      <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  ) : profile ? (
                    <>
                      <h1 className="text-2xl font-bold text-neutral-900">
                        {profile.firstName} {profile.lastName}
                      </h1>
                      <p className="text-neutral-600">{profile.email}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active Account
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
                
                {/* Edit Button */}
                <div className="md:self-start">
                  <button className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-light text-primary-dark font-medium hover:bg-primary hover:text-white transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs and Content */}
        <div className="pt-24 max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 p-4 rounded-xl text-red-700 mb-6 border border-red-100">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 mb-8">
            <nav className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'profile' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Profile Information
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'orders' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'security' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Security & Settings
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
            {activeTab === 'profile' && (
              <div className="divide-y divide-neutral-200">
                {loading ? (
                  <div className="p-10 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : profile ? (
                  <>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-500 mb-1">First Name</label>
                          <p className="text-neutral-900">{profile.firstName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-500 mb-1">Last Name</label>
                          <p className="text-neutral-900">{profile.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-500 mb-1">Email Address</label>
                          <p className="text-neutral-900">{profile.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-500 mb-1">Phone Number</label>
                          <p className="text-neutral-900">Add your phone number</p>
                        </div>
                      </div>
                    </div>
                    
                    
                  </>
                ) : null}
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="p-6">
                <div className="text-center py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders yet</h3>
                  <p className="text-neutral-600 mb-4">When you make a purchase, your order history will appear here.</p>
                  <Link to="/" className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="divide-y divide-neutral-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Password</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-900 font-medium">Change your password</p>
                      <p className="text-sm text-neutral-500">It's a good idea to use a strong password that you're not using elsewhere</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-primary-light text-primary-dark font-medium hover:bg-primary hover:text-white transition duration-200">
                      Update
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-900 font-medium">Add an extra layer of security</p>
                      <p className="text-sm text-neutral-500">We'll ask for a verification code in addition to your password when you sign in</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition duration-200">
                      Set up
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input id="email-notifications" name="email-notifications" type="checkbox" 
                        className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded" />
                      <label htmlFor="email-notifications" className="ml-3 block text-sm text-neutral-700">
                        Email notifications for orders and sales
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="marketing-emails" name="marketing-emails" type="checkbox" 
                        className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded" />
                      <label htmlFor="marketing-emails" className="ml-3 block text-sm text-neutral-700">
                        Receive marketing emails and special offers
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 