import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Sun, Moon, Menu, Plus, LogOut, LogIn,
} from 'lucide-react';
import { Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/PostCard';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import CategoryFilter from '@/components/CategoryFilter';
import { useAuth } from '@/contexts/AuthContext';
import { highlightText } from '@/utils/highlightText';

const DEBOUNCE_DELAY = 300;
const PAGE_SIZE = 6;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchAllPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://user-service-oyy1.onrender.com/api/posts/public');
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllPosts(); }, []);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery.trim()), DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredPosts = useMemo(() => {
    const base = selectedCategory === 'All' ? posts : posts.filter(p => p.tags?.includes(selectedCategory));
    if (!debouncedQuery || debouncedQuery.length < 2) return base;
    const q = debouncedQuery.toLowerCase();
    return base.filter(p => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
  }, [posts, selectedCategory, debouncedQuery]);

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const postsToDisplay = filteredPosts.slice(0, page * PAGE_SIZE);

  const handleIntersect: IntersectionObserverCallback = entries => {
    if (entries[0].isIntersecting && page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filteredPosts, page]);

  const suggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    return filteredPosts.slice(0, 5);
  }, [filteredPosts, debouncedQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.trim().length >= 2);
  };
  const handleFocus = () => debouncedQuery.length >= 2 && setShowSuggestions(true);
  const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);
  const handleSuggestionClick = (slug, id) => navigate(`/post/${slug || id}`);
  const handleUserClick = () => user ? logout() : setIsLoginModalOpen(true);
  const handleNewPostClick = () => user ? navigate('/create-post') : setIsLoginModalOpen(true);
  const toggleDark = () => {
    setIsDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-fixed bg-cover bg-center relative flex-grow" style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}java-bg.jpeg)`,
      }}>
        <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10">
          {/* Modals */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToRegister={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}
          />
          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onSwitchToLogin={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />

          {/* Header */}
          <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/60 border-b border-white/30 dark:border-black/30">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-2">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Dev</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Voices of Java Dev</span>
                </Link>
                <nav className="hidden md:flex space-x-6 ml-80">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <Link to="/contact">Contact</Link>
                </nav>
                <div className="flex items-center space-x-4">
                  <div className="relative hidden sm:flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className="pl-10 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute top-full left-0 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md z-50 max-h-60 overflow-y-auto shadow-lg">
                        {suggestions.map(p => (
                          <li
                            key={p._id}
                            onMouseDown={() => handleSuggestionClick(p.slug, p._id)}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            <div className="font-semibold" dangerouslySetInnerHTML={{
                              __html: highlightText(p.title, debouncedQuery)
                            }} />
                            <div className="text-sm text-gray-500">
                              {(p.tags || []).map(tag => `#${tag}`).join(' ')}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={toggleDark}>
                    {isDarkMode ? <Sun /> : <Moon />}
                  </Button>
                  <Button variant="default" size="sm" onClick={handleNewPostClick}>
                    <Plus className="mr-1" /> New Post
                  </Button>
                  {user ? (
                    <>
                      <span className="hidden sm:inline text-gray-700 dark:text-gray-300">{user.email}</span>
                      <Button variant="ghost" size="sm" onClick={handleUserClick}>
                        <LogOut className="mr-1" /> Logout
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={handleUserClick}>
                      <LogIn className="mr-1" /> Login
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(d => !d)}>
                    <Menu />
                  </Button>
                </div>
              </div>
              {isMenuOpen && (
                <nav className="md:hidden py-4 border-t dark:border-gray-700 space-y-2">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <Link to="/contact">Contact</Link>
                </nav>
              )}
            </div>
          </header>

          {/* Mobile Search Bar */}
<div className="sm:hidden px-4 pt-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <Input
      placeholder="Search articles..."
      value={searchQuery}
      onChange={handleSearchChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="pl-10 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    />
    {showSuggestions && suggestions.length > 0 && (
      <ul className="absolute top-full left-0 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md z-50 max-h-60 overflow-y-auto shadow-lg">
        {suggestions.map(p => (
          <li
            key={p._id}
            onMouseDown={() => handleSuggestionClick(p.slug, p._id)}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          >
            <div className="font-semibold" dangerouslySetInnerHTML={{
              __html: highlightText(p.title, debouncedQuery)
            }} />
            <div className="text-sm text-gray-500">
              {(p.tags || []).map(tag => `#${tag}`).join(' ')}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


          {/* Hero */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 mt-20">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Amazing Stories</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">Insights, tutorials, and perspectives from the world of tech</p>
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Reading
              </Button>
            </div>
          </section>

          {/* Posts */}
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {debouncedQuery.length >= 2 ? 'Search Results' : 'Latest Posts'}
              </h2>
              <CategoryFilter
                categories={['All', ...Array.from(new Set(posts.flatMap(p => p.tags || [])))]}
                selectedCategory={selectedCategory}
                onCategoryChange={(c) => { setSelectedCategory(c); setPage(1); }}
              />
            </div>

            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : postsToDisplay.length === 0 ? (
              <p className="text-gray-500">No matching posts found.</p>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {postsToDisplay.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onPostUpdated={fetchAllPosts}
                      highlightQuery={debouncedQuery}
                    />
                  ))}
                </div>
                {page < totalPages && (
                  <div ref={loaderRef} className="py-4">
                    <p className="text-center text-gray-500">Loading more...</p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 dark:bg-black text-white py-12 mt-auto transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <span className="text-xl font-bold">Java Dev</span>
                  </div>
                  <p className="text-gray-400">A modern blog platform for sharing Java ideas and insights.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Navigation</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/" className="hover:text-white">Home</Link></li>
                    <li><Link to="/about" className="hover:text-white">About</Link></li>
                    <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Topics</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/tag/technology" className="hover:text-white">Technology</Link></li>
                    <li><Link to="/tag/java" className="hover:text-white">Java</Link></li>
                    <li><Link to="/tag/microservices" className="hover:text-white">Microservices</Link></li>
                  </ul>
                </div>
                <div>
  <h3 className="font-semibold mb-4">Connect</h3>
  <p className="text-gray-400 mb-2">Follow us for the latest Java development updates.</p>
  <div className="flex space-x-4 mt-2">
    <a href="https://github.com/Voice-of-Java-Dev" target="_blank" rel="noopener noreferrer">
      <Github className="w-5 h-5 hover:text-white text-gray-400" />
    </a>
    <a href="https://www.linkedin.com/in/voices-of-java-dev-b031b0372/" target="_blank" rel="noopener noreferrer">
      <Linkedin className="w-5 h-5 hover:text-white text-gray-400" />
    </a>
    <a href="https://www.instagram.com/voices_javadev/profilecard/?igsh=MW5wMWx5ZTNzdDNhZg==" target="_blank" rel="noopener noreferrer">
      <Instagram className="w-5 h-5 hover:text-white text-gray-400" />
    </a>
  </div>
</div>

              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Voices of Java Dev. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
