'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const categories = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'History',
  'Geography',
  'Languages',
  'Other',
];

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    price: 0,
    status: 'draft' as const,
  });
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  if (session?.user?.role !== 'teacher') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    setError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create the course
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create course');
      }

      if (!data.success) {
        throw new Error(data.error || 'Invalid response from server');
      }

      toast.success('Course created successfully!');
      
      // Navigate to the manage page
      router.push('/dashboard/courses/manage');
      router.refresh();
    } catch (err) {
      console.error('Create course error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create course');
      toast.error(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Course title is required');
      toast.error('Course title is required');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Course description is required');
      toast.error('Course description is required');
      return false;
    }

    if (!formData.category) {
      setError('Please select a category');
      toast.error('Please select a category');
      return false;
    }

    if (formData.price < 0) {
      setError('Price cannot be negative');
      toast.error('Price cannot be negative');
      return false;
    }

    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
        <p className="text-gray-500 dark:text-gray-400">Fill in the details to create a new course</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Course Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter course title"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description"
            required
            className="w-full px-4 py-2.5 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Course Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter course price"
            min="0"
            step="0.01"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Image
          </label>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Course preview"
                  width={400}
                  height={225}
                  className="rounded-lg mx-auto"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <ImagePlus className="w-12 h-12 mx-auto text-gray-400" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Drag &apos;n&apos; drop an image here, or click to select
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/dashboard/courses/manage"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isLoading || uploadingImage}
            className="!bg-gradient-to-r !from-pink-500 !to-blue-500 hover:!from-pink-600 hover:!to-blue-600"
          >
            {isLoading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
} 