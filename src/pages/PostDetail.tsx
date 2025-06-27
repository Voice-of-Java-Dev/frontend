import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TagBadge from '@/components/TagBadge';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://user-service-oyy1.onrender.com/api/posts/slug/${slug}`);
        setPost(response.data);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const deletePost = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://user-service-oyy1.onrender.com/api/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      navigate('/');
    } catch (err) {
      alert('Failed to delete the post');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tags and Title */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={post.author?.avatarUrl || '/default-avatar.jpg'}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{post.author?.name}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime || '5 min read'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social share buttons */}
            <div className="flex items-center space-x-2">
  {/* Twitter Share */}
  <a
    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 flex items-center px-2 py-1 rounded hover:bg-blue-50"
  >
    <Twitter className="w-4 h-4 mr-1" />
    Tweet
  </a>

  {/* Facebook Share */}
  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-700 flex items-center px-2 py-1 rounded hover:bg-blue-50"
  >
    <Facebook className="w-4 h-4 mr-1" />
    Share
  </a>

  {/* LinkedIn Share */}
  <a
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-800 flex items-center px-2 py-1 rounded hover:bg-blue-50"
  >
    <Linkedin className="w-4 h-4 mr-1" />
    Share
  </a>
</div>

          </div>
        </header>

        {/* Cover image */}
        <div className="mb-8">
          <img
            src={post.image || '/fallback-image.jpg'}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Post content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author bio */}
        <div className="bg-white rounded-xl p-6 mt-8 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">About the Author</h3>
          <div className="flex items-start space-x-4">
            <img
              src={post.author?.avatarUrl || '/default-avatar.jpg'}
              alt={post.author?.name}
              className="w-16 h-16 rounded-full object-cover object-center border-2 border-gray-300 shadow-md bg-white"
            />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">{post.author?.name}</h4>
              <p className="text-gray-600">{post.author?.bio || 'No bio available.'}</p>
            </div>
          </div>
        </div>

        {/* Edit/Delete buttons only for post author */}
        {user?.id === post.author?._id && (
          <div className="mt-6 flex gap-4">
            <Link to={`/edit/${post._id}`}>
              <Button variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={deletePost}
            >
              Delete
            </Button>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;
