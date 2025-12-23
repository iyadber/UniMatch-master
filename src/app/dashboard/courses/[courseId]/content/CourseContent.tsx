'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Plus, Video, Trash2, Play, ArrowLeft, Eye, AlertCircle, X, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Video {
  _id: string;
  title: string;
  url: string;
  description: string;
  order: number;
}

interface PdfDocument {
  _id: string;
  title: string;
  url: string;
  description: string;
  order: number;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isValidVideoUrl(url: string): boolean {
  // Add support for more video platforms as needed
  const youtubeUrl = getYouTubeEmbedUrl(url);
  return !!youtubeUrl;
}

export default function CourseContent({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    description: '',
  });
  const [newPdf, setNewPdf] = useState({
    title: '',
    description: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileError, setPdfFileError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [pdfToDelete, setPdfToDelete] = useState<PdfDocument | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [activeTab, setActiveTab] = useState('videos');

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/videos`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch videos');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch videos');
      }
      setVideos(data.videos);
      if (data.videos.length > 0 && !selectedVideo) {
        setSelectedVideo(data.videos[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch videos');
    }
  }, [courseId, selectedVideo]);

  const fetchPdfs = useCallback(async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/pdfs`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch PDFs');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch PDFs');
      }
      setPdfs(data.pdfs);
      if (data.pdfs.length > 0 && !selectedPdf) {
        setSelectedPdf(data.pdfs[0]);
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch PDFs');
    }
  }, [courseId, selectedPdf]);

  useEffect(() => {
    if (session?.user) {
      fetchVideos();
      fetchPdfs();
    }
  }, [courseId, session, fetchVideos, fetchPdfs]);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setUrlError('');

    try {
      if (!isValidVideoUrl(newVideo.url)) {
        setUrlError('Please enter a valid YouTube video URL');
        return;
      }

      const embedUrl = getYouTubeEmbedUrl(newVideo.url);
      const response = await fetch(`/api/courses/${courseId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVideo,
          url: embedUrl,
          order: videos.length,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add video');
      }

      setVideos([...videos, data.video]);
      setSelectedVideo(data.video);
      setNewVideo({ title: '', url: '', description: '' });
    } catch (err) {
      console.error('Error adding video:', err);
      setError(err instanceof Error ? err.message : 'Failed to add video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = (video: Video) => {
    setVideoToDelete(video);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch(`/api/courses/${courseId}/videos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId: videoToDelete._id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete video');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete video');
      }

      setVideos(videos.filter(v => v._id !== videoToDelete._id));
      if (selectedVideo?._id === videoToDelete._id) {
        setSelectedVideo(videos.find(v => v._id !== videoToDelete._id) || null);
      }
      setVideoToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete video');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPdfFileError('');

    try {
      if (!pdfFile) {
        setPdfFileError('Please select a PDF file to upload');
        setIsLoading(false);
        return;
      }

      if (pdfFile.type !== 'application/pdf') {
        setPdfFileError('Please upload a valid PDF file');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('title', newPdf.title);
      formData.append('description', newPdf.description);
      formData.append('order', pdfs.length.toString());

      const response = await fetch(`/api/courses/${courseId}/pdfs`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add PDF');
      }

      setPdfs([...pdfs, data.pdf]);
      setSelectedPdf(data.pdf);
      setNewPdf({ title: '', description: '' });
      setPdfFile(null);
    } catch (err) {
      console.error('Error adding PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to add PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePdf = (pdf: PdfDocument) => {
    setPdfToDelete(pdf);
  };

  const confirmDeletePdf = async () => {
    if (!pdfToDelete) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch(`/api/courses/${courseId}/pdfs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pdfId: pdfToDelete._id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete PDF');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete PDF');
      }

      setPdfs(pdfs.filter(p => p._id !== pdfToDelete._id));
      if (selectedPdf?._id === pdfToDelete._id) {
        setSelectedPdf(pdfs.find(p => p._id !== pdfToDelete._id) || null);
      }
      setPdfToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete PDF');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
      </div>
    );
  }

  // Determine if user can edit (teachers can add/delete content)
  const canEdit = session?.user?.role === 'teacher' || session?.user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <div className="mb-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Link href={canEdit ? "/dashboard/courses/manage" : "/dashboard/student"}>
              <Button variant="secondary" className="!p-2 hover:scale-105 transition-transform">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                Course Content
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {canEdit ? 'Add and manage your course materials' : 'Watch and learn from course materials'}
              </p>
            </div>
          </div>
          {canEdit && (
            <Link
              href={`/dashboard/courses/preview/${courseId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto group hover:border-blue-500 transition-colors"
              >
                <Eye className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                <span className="group-hover:text-blue-500 transition-colors">Preview Course</span>
              </Button>
            </Link>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="pdfs" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>PDF Documents</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Video Preview */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
              {selectedVideo ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-900 relative">
                    {selectedVideo.url ? (
                      <iframe
                        src={selectedVideo.url}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                          <p>Invalid video URL</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {selectedVideo.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {selectedVideo.description}
                        </p>
                      </div>
                      {canEdit && (
                        <Button
                          variant="secondary"
                          onClick={() => handleDeleteVideo(selectedVideo)}
                          className="!p-1.5 hover:!bg-red-50 dark:hover:!bg-red-900/20 hover:border-red-500 transition-colors !w-[26px] h-[26px] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Video className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No video selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Select a video from the list to preview it here. You can add new videos using the form below.
                  </p>
                </div>
              )}
            </div>

            {/* Video List and Form */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              {/* Video List */}
              {videos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course Videos
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video._id}
                        onClick={() => setSelectedVideo(video)}
                        className={clsx(
                          'p-4 rounded-lg border transition-colors duration-200 cursor-pointer',
                          selectedVideo?._id === video._id
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
                        )}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {video.description}
                            </p>
                          </div>
                        </div>
                        {canEdit && (
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVideo(video);
                            }}
                            className="!p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:!bg-red-50 dark:hover:!bg-red-900/20 hover:border-red-500 scale-90 hover:scale-100 flex-shrink-0 !w-[26px] h-[26px] flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Video Form - Only for teachers */}
              {canEdit && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Add New Video</h2>
                  </div>
                  <form onSubmit={handleAddVideo} className="p-6 space-y-4">
                    <Input
                      label="Video Title"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      required
                    />
                    <div className="space-y-2">
                      <Input
                        label="YouTube Video URL"
                        value={newVideo.url}
                        onChange={(e) => {
                          setNewVideo({ ...newVideo, url: e.target.value });
                          setUrlError('');
                        }}
                        error={urlError}
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <Play className="w-3 h-3" />
                        <span>Supported: youtube.com/watch?v=..., youtu.be/...</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        value={newVideo.description}
                        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        rows={3}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full !bg-gradient-to-r !from-pink-500 !to-blue-500 hover:!from-pink-600 hover:!to-blue-600 !py-3 !text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {isLoading ? 'Adding...' : 'Add Video'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdfs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* PDF Preview */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
              {selectedPdf ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-900 relative">
                    {selectedPdf.url ? (
                      <iframe
                        src={selectedPdf.url}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                          <p>PDF cannot be displayed</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {selectedPdf.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {selectedPdf.description}
                        </p>
                      </div>
                      {canEdit && (
                        <Button
                          variant="secondary"
                          onClick={() => handleDeletePdf(selectedPdf)}
                          className="!p-1.5 hover:!bg-red-50 dark:hover:!bg-red-900/20 hover:border-red-500 transition-colors !w-[26px] h-[26px] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No PDF selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Select a PDF from the list to preview it here. You can add new PDFs using the form below.
                  </p>
                </div>
              )}
            </div>

            {/* PDF List and Form */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              {/* PDF List */}
              {pdfs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course PDFs
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {pdfs.map((pdf) => (
                      <div
                        key={pdf._id}
                        onClick={() => setSelectedPdf(pdf)}
                        className={clsx(
                          'p-4 rounded-lg border transition-colors duration-200 cursor-pointer',
                          selectedPdf?._id === pdf._id
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
                        )}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {pdf.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {pdf.description}
                            </p>
                          </div>
                        </div>
                        {canEdit && (
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePdf(pdf);
                            }}
                            className="!p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:!bg-red-50 dark:hover:!bg-red-900/20 hover:border-red-500 scale-90 hover:scale-100 flex-shrink-0 !w-[26px] h-[26px] flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add PDF Form - Only for teachers */}
              {canEdit && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Add New PDF</h2>
                  </div>
                  <form onSubmit={handleAddPdf} className="p-6 space-y-4">
                    <Input
                      label="PDF Title"
                      value={newPdf.title}
                      onChange={(e) => setNewPdf({ ...newPdf, title: e.target.value })}
                      required
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload PDF File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-500 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="application/pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setPdfFile(file);
                                  setPdfFileError('');
                                }}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF up to 10MB
                          </p>
                          {pdfFile && (
                            <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center mt-2">
                              <FileText className="w-4 h-4 mr-1" />
                              {pdfFile.name}
                            </p>
                          )}
                          {pdfFileError && (
                            <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-2">
                              {pdfFileError}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        value={newPdf.description}
                        onChange={(e) => setNewPdf({ ...newPdf, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        rows={3}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full !bg-gradient-to-r !from-pink-500 !to-blue-500 hover:!from-pink-600 hover:!to-blue-600 !py-3 !text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {isLoading ? 'Uploading...' : 'Upload PDF'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog - Videos */}
      {videoToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Video
                </h3>
                <button
                  onClick={() => setVideoToDelete(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete the video &quot;{videoToDelete?.title}&quot;? This action cannot be undone.
                </p>
                {deleteError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {deleteError}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setVideoToDelete(null)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 !bg-red-600 hover:!bg-red-700 dark:!bg-red-500 dark:hover:!bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog - PDFs */}
      {pdfToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete PDF
                </h3>
                <button
                  onClick={() => setPdfToDelete(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete the PDF &quot;{pdfToDelete?.title}&quot;? This action cannot be undone.
                </p>
                {deleteError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {deleteError}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setPdfToDelete(null)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeletePdf}
                  className="flex-1 !bg-red-600 hover:!bg-red-700 dark:!bg-red-500 dark:hover:!bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 