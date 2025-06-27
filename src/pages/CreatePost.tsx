import React, { useState, useEffect, useRef } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [['bold', 'italic'], [{ color: [] }], ['clean']],
};

const CreatePost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isPublishing, setIsPublishing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  // Escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [navigate]);

  // Click outside modal to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        navigate('/');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      if (authorImagePreview) URL.revokeObjectURL(authorImagePreview);
    };
  }, [coverImagePreview, authorImagePreview]);

  // ✅ Unified handler for both previews
  const handleImagePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'author'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'cover') {
        setCoverImage(file);
        setCoverImagePreview(previewUrl);
      } else {
        setAuthorImage(file);
        setAuthorImagePreview(previewUrl);
      }
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !excerpt || !coverImage || !tags || !content || !authorName || !authorBio || !authorImage) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('excerpt', excerpt);
      formData.append('coverImage', coverImage);
      formData.append('tags', tags);
      formData.append('content', content);
      formData.append('authorName', authorName);
      formData.append('authorBio', authorBio);
      formData.append('authorImage', authorImage);
      formData.append('status', status);

      const res = await fetch('https://user-service-oyy1.onrender.com/api/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to publish post.');
      }

      toast({ title: 'Success', description: 'Post created successfully.' });
      navigate('/');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Post</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handlePublish} className="space-y-5">
          <div>
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter a title for your article"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              placeholder="Enter a short summary"
            />
          </div>

          <div>
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImagePreview(e, 'cover')}
              required
            />
            {coverImagePreview && (
              <img src={coverImagePreview} alt="Cover" className="mt-2 w-full max-h-64 object-cover rounded-md" />
            )}
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
             <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              placeholder="Enter tags like react, spring, web"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Write your full article content here..."
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="authorName">Author Name</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="authorBio">Author Bio</Label>
             <Textarea
              id="authorBio"
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              required
              placeholder="Write a short bio about yourself"
            />
          </div>

          <div>
            <Label htmlFor="authorImage">Author Image</Label>
            <Input
              id="authorImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImagePreview(e, 'author')}
              required
            />
            {authorImagePreview && (
              <img src={authorImagePreview} className="mt-2 w-24 h-24 rounded-full" alt="Author" />
            )}
          </div>

          <div>
            <Label htmlFor="status">Post Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800"
              required
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isPublishing ? 'Publishing...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
