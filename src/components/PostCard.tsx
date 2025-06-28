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
  highlightQuery?: string;
}

const PostCard = ({ post, featured = false }: PostCardProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ✅ Extract email from JWT
  let currentUserEmail = '';
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserEmail = payload.sub;
    }
  } catch (err) {
    console.error('❌ Failed to decode JWT:', err);
  }

  const authorName =
    typeof post.author === 'object' && post.author?.name
      ? post.author.name
      : typeof post.author === 'string'
      ? post.author
      : 'Unknown Author';

  const handleNavigate = () => navigate(`/post/${post.slug}`);

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
      </div>
    </article>
  );
};

export default PostCard;
