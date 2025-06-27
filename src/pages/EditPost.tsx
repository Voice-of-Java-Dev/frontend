import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string>('');

  useEffect(() => {
  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://user-service-oyy1.onrender.com/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPost(data);
      setAuthorImagePreview(data.author?.avatar);
      setLoading(false);
    } catch (err) {
      toast({ title: 'Failed to load post', variant: 'destructive' });
    }
  };

  fetchPost();
}, [id]);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !post) return;

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('excerpt', post.excerpt);
    formData.append('content', post.content);
    formData.append('tags', post.tags?.join(',') || '');
    formData.append('authorName', post.author?.name || '');
    formData.append('authorBio', post.author?.bio || '');
    formData.append('image', post.image || '');
    if (authorImageFile) formData.append('authorImage', authorImageFile);

    const res = await fetch(`https://user-service-oyy1.onrender.com/api/posts/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      toast({ title: 'Post updated successfully' });
      navigate('/');
    } else {
      toast({ title: 'Update failed', variant: 'destructive' });
    }
  };

  if (loading || !post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} />
        </div>
        <div>
          <Label>Cover Image URL</Label>
          <Input value={post.image} onChange={(e) => setPost({ ...post, image: e.target.value })} />
        </div>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input value={post.tags?.join(',')} onChange={(e) => setPost({ ...post, tags: e.target.value.split(',') })} />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })} />
        </div>
        <div>
          <Label>Author Name</Label>
          <Input value={post.author?.name} onChange={(e) => setPost({ ...post, author: { ...post.author, name: e.target.value } })} />
        </div>
        <div>
          <Label>Author Bio</Label>
          <Textarea value={post.author?.bio} onChange={(e) => setPost({ ...post, author: { ...post.author, bio: e.target.value } })} />
        </div>
        <div>
          <Label>Change Author Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAuthorImageFile(file);
              setAuthorImagePreview(URL.createObjectURL(file));
            }
          }} />
          {authorImagePreview && <img src={authorImagePreview} className="h-24 w-24 rounded-full mt-2" />}
        </div>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Update
        </Button>
      </form>
    </div>
  );
};

export default EditPost;
