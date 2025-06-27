import { useNavigate } from 'react-router-dom';
import { Clock, User, Calendar } from 'lucide-react';
import TagBadge from './TagBadge';
import { highlightText } from '@/utils/highlightText';


interface Post {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string | { _id?: string; name?: string; email?: string };
  createdAt: string;
  readTime: string;
  tags: string[];
  slug: string;
  visibility: 'PUBLIC' | 'PRIVATE';
}

interface PostCardProps {
  post: Post;
  featured?: boolean;
  onPostUpdated?: () => void;
  highlightQuery?: string; // ✅ Add this
}



const PostCard = ({ post, featured = false, onPostUpdated }: PostCardProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://user-service-oyy1.onrender.com';

  // ✅ Extract email from JWT
  let currentUserEmail = '';
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserEmail = payload.sub;
      console.log('👤 Current User Email:', currentUserEmail); // ✅ Debug log
    }
  } catch (err) {
    console.error('❌ Failed to decode JWT:', err);
  }

  // ✅ Normalize author info
  const authorName =
    typeof post.author === 'object' && post.author?.name
      ? post.author.name
      : typeof post.author === 'string'
      ? post.author
      : 'Unknown Author';

  const authorEmail =
  typeof post.author === 'object'
    ? post.author?.email || post.author?.name || ''
    : typeof post.author === 'string'
    ? post.author
    : '';


  const isAuthor = currentUserEmail === authorEmail;

  console.log('👤 Current User Email:', currentUserEmail);
console.log('✍️ Author Email:', authorEmail);
console.log('✅ isAuthor:', isAuthor);

  const handleNavigate = () => navigate(`/post/${post.slug}`);

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post._id}/visibility`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok && onPostUpdated) onPostUpdated();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleDeletePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok && onPostUpdated) onPostUpdated();
      else console.error('Delete failed:', res.status, await res.text());
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit/${post._id}`);
  };

  return (
    <article
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        featured ? 'border-l-4 border-l-blue-500' : ''
      }`}
    >
      {/* Post Image */}
      <div className="relative overflow-hidden">
        <img
          src={post.image || '/fallback-image.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={handleNavigate}
        />
        {featured && (
          <span className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-4">{authorName}</span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h2
          onClick={handleNavigate}
          className={`font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 ${
            featured ? 'text-xl' : 'text-lg'
          } cursor-pointer`}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Created Date & Read More */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {new Date(post.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
          <span
            onClick={handleNavigate}
            className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
          >
            Read more →
          </span>
        </div>

        {/* Action Buttons (Only visible to post's author) */}
        {isAuthor && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleToggleVisibility}
              className="text-xs text-blue-600 hover:underline"
            >
              {post.visibility === 'PUBLIC' ? 'Make Private' : 'Make Public'}
            </button>

            <button
              onClick={handleEditPost}
              className="text-xs text-green-600 hover:underline"
            >
              Edit
            </button>

            <button
              onClick={handleDeletePost}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
