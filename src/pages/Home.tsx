import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import TagBadge from '@/components/TagBadge';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import ChatbotWidget from '@/components/ChatbotWidget'; // ✅ Import ChatbotWidget

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://user-service-oyy1.onrender.com/api/posts/public');
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading posts...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <>
      <div className="relative min-h-screen">
        {/* ✅ Background */}
        <div
          className="fixed inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url("/java-bg.jpeg")` }}
        />
        <div className="fixed inset-0 bg-white/90 dark:bg-black/70 backdrop-blur-sm z-0" />

        {/* ✅ Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Latest Posts
          </h1>

          <div className="grid gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 border"
              >
                <Link to={`/post/${post.slug || post._id}`}>
                  <img
                    src={post.image || '/fallback-image.jpg'}
                    alt={post.title}
                    className="w-full h-52 object-cover rounded-md mb-4"
                  />
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(post.tags || []).map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : 'Unknown date'}
                    <span className="ml-4">by {post.author?.name || 'Unknown'}</span>
                  </div>
                </Link>

                {/* ✅ Step 3: Show buttons if current user is the author */}
                {user?.email === post.author?.email && (
                  <div className="mt-4 flex gap-4">
                    <Link
                      to={`/edit/${post._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        // TODO: Delete handler
                        alert('Implement delete logic');
                      }}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Add Chatbot */}
      <ChatbotWidget />
    </>
  );
};

export default Home;
