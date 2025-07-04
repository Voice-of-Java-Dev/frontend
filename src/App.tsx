import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemesContext';
import './index.css';

import Index from './pages/Index';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import CreatePost from './pages/CreatePost';
import NotFound from './pages/NotFound';
import EditPost from './pages/EditPost';
import MyPosts from './pages/MyPosts';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/0197d4eaa0dc7e088d5f526a78f0ae136326/embed.js?skipWelcome=1&maximizable=1';
    script.async = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

          {/* ✅ Floating Chatbot will auto-load */}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
