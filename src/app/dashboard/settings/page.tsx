'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Key, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  GraduationCap,
  Clock,
  DollarSign,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      marketing: false
    }
  });

  const isTeacher = session?.user?.role === 'teacher';

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: !prev.notifications[name as keyof typeof prev.notifications]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    // Show success message here
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'password', label: 'Password', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  // Teacher-specific tabs
  const teacherTabs = [
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  // Student-specific tabs
  const studentTabs = [
    { id: 'enrollments', label: 'My Enrollments', icon: GraduationCap },
    { id: 'sessions', label: 'Session History', icon: Clock },
  ];

  const combinedTabs = [
    ...tabs,
    ...(isTeacher ? teacherTabs : studentTabs),
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'terms', label: 'Terms', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Profile Information</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update your profile information and how others see you on the platform.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white text-4xl font-semibold">
                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
              </div>
              
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder={isTeacher ? "Describe your teaching experience and expertise..." : "Tell us about yourself..."}
                  />
                </div>

                {isTeacher && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Specializations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        Mathematics
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        Computer Science
                      </span>
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-sm">
                        Physics
                      </span>
                      <Button variant="outline" size="sm" className="h-7">
                        + Add
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Account Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences.
            </p>
            
            {/* Account settings content */}
          </div>
        );
        
      case 'password':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Change Password</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update your password to maintain account security.
            </p>
            
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="pt-4">
                <Button isLoading={isLoading}>
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Notification Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose what notifications you receive and how.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about important updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.notifications.email}
                    onChange={() => handleToggleChange('email')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.notifications.push}
                    onChange={() => handleToggleChange('push')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">Marketing Emails</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new features and offerings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.notifications.marketing}
                    onChange={() => handleToggleChange('marketing')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <Button isLoading={isLoading}>
                Save Preferences
              </Button>
            </div>
          </div>
        );
        
      // Teacher-specific tabs
      case 'courses':
        if (!isTeacher) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">My Courses</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your courses, content, and student enrollments.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((course) => (
                <div key={course} className="bg-white dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50">Advanced Mathematics {course}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">24 students enrolled</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl overflow-hidden border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center h-[232px]">
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Create New Course</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                    Start building your next educational content
                  </p>
                  <Button variant="default" size="sm">
                    Create Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'availability':
        if (!isTeacher) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Teaching Availability</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Set your available hours for tutoring sessions.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-lg mb-3 text-gray-900 dark:text-gray-50">Weekly Schedule</h3>
                
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800/70 last:border-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{day}</span>
                    <div className="flex items-center space-x-2">
                      <select className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                      </select>
                      <span className="text-gray-500">to</span>
                      <select className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Button>
                    Save Schedule
                  </Button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-lg mb-3 text-gray-900 dark:text-gray-50">Upcoming Sessions</h3>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((session) => (
                    <div key={session} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-50">Tutoring Session #{session}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">with Student Name</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Upcoming
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="mr-1" />
                        Tomorrow, 10:00 AM - 11:00 AM
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'payments':
        if (!isTeacher) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Payment Information</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your payment methods and view earnings.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-lg mb-3 text-gray-900 dark:text-gray-50">Payment Method</h3>
                
                <div className="space-y-4">
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-50">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Default
                    </span>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    + Add Payment Method
                  </Button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-lg mb-3 text-gray-900 dark:text-gray-50">Earnings Overview</h3>
                
                <div className="mt-2 space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">$1,245.00</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 12% from last month</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Payments</h4>
                    
                    <div className="space-y-2">
                      {[1, 2, 3].map((payment) => (
                        <div key={payment} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-50">Session Payment</p>
                            <p className="text-gray-500 dark:text-gray-400">May 15, 2023</p>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-50">$45.00</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      // Student-specific tabs
      case 'enrollments':
        if (isTeacher) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">My Enrollments</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your course enrollments.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((course) => (
                <div key={course} className="bg-white dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50">Course Name {course}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Teacher: Professor Name</p>
                    <div className="mt-2 flex items-center">
                      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-gradient-to-r from-blue-500 to-pink-500" 
                          style={{width: `${course * 15}%`}}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{course * 15}%</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="default" size="sm" className="w-full">
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button variant="outline">
                Browse More Courses
              </Button>
            </div>
          </div>
        );
        
      case 'sessions':
        if (isTeacher) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Session History</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View your past and upcoming tutoring sessions.
            </p>
            
            <div className="flex space-x-4 overflow-x-auto pb-2">
              <Button variant={activeTab === 'sessions' ? 'default' : 'outline'} className="whitespace-nowrap">
                All Sessions
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                Upcoming
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                Completed
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                Cancelled
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { status: 'upcoming', date: 'Tomorrow' },
                { status: 'upcoming', date: 'May 20, 2023' },
                { status: 'completed', date: 'May 15, 2023' },
                { status: 'completed', date: 'May 10, 2023' },
                { status: 'cancelled', date: 'May 5, 2023' }
              ].map((session, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-50">Session with Professor Name</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Topic: Advanced Calculus</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      session.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : session.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} className="mr-1" />
                      {session.date}, 10:00 AM - 11:00 AM
                    </div>
                    
                    {session.status === 'upcoming' && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="default" size="sm">
                          Join
                        </Button>
                      </div>
                    )}
                    
                    {session.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This section is under development.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Settings Tab Navigation */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 h-fit border border-gray-100 dark:border-gray-800">
          <nav className="space-y-1">
            {combinedTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                }`}
              >
                <tab.icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Settings Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
} 