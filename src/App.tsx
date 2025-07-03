import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
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
import ChatbotWidget from '@/components/ChatbotWidget'; // ✅ Import ChatbotWidget

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
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

          {/* ✅ Add chatbot at the end so it overlays other content */}
          <ChatbotWidget />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
