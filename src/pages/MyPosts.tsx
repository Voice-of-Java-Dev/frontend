import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = 'https://user-service-oyy1.onrender.com/api/posts/me';
      if (filter !== 'all') endpoint += `/${filter}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to load posts');

      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user, filter]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>

      {/* Filter Buttons */}
      <div className="mb-4 flex space-x-2">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'font-bold' : ''}>All</button>
        <button onClick={() => setFilter('published')} className={filter === 'published' ? 'font-bold' : ''}>Published</button>
        <button onClick={() => setFilter('draft')} className={filter === 'draft' ? 'font-bold' : ''}>Draft</button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">Status: {post.status}</p>
              <Link to={`/edit/${post.id}`} className="text-blue-600 hover:underline mt-2 inline-block">Edit</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;
