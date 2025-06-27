import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, Github, Linkedin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePost from '@/pages/CreatePost';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemesContext';

const About = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartWriting = () => {
    if (user) setShowCreateModal(true);
    else setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setShowCreateModal(true);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900 border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Voices of Java Dev</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            A space for Java developers to share experiences, tools, frameworks, and innovations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Mission */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Voices of Java Dev was built for one purpose — to bring Java developers together to
            share real-world experiences, insights, and stories.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our mission is to provide an open and welcoming platform for Java enthusiasts to
            publish technical content, inspire others, and grow together.
          </p>
        </section>

        {/* Values */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What We Value</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['🧠', 'Knowledge Sharing', 'Every Java developer has something valuable to share — and we’re here for all of it.'],
              ['🛠️', 'Modern Tools', 'Stay updated on frameworks, libraries, and innovations like Spring AI, Quarkus, GraalVM, and more.'],
              ['🌐', 'Community First', 'We value authentic stories, helpful tutorials, and meaningful collaboration.'],
            ].map(([icon, title, desc], i) => (
              <div className="text-center" key={i}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Behind the Project */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Behind the Project</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
            This platform was designed and developed by Java developers, for Java developers. It’s a passion project built to empower contributors to explore everything from language updates to cloud-native patterns — and share them with the world.
          </p>
        </section>

        {/* Meet the Creator */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet the Creator</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                name: 'Lakshmi Prasanna Kumar',
                role: 'Founder & Java Dev',
                bio: 'Full Stack Java Developer passionate about sharing tools, frameworks, and innovations in the Java ecosystem.',
                img: 'https://i.ibb.co/mFDXc9tS/profile-pic.jpg',
                github: 'https://github.com/Chaiudbbhd',
                linkedin: 'https://www.linkedin.com/in/prasanna-kumar-g-3377a825a/',
              },
              {
                name: 'Arvind Patnaik',
                role: 'Tech Writer',
                bio: 'Shares Java best practices and writes about productivity tools, testing frameworks, and Spring updates.',
                img: 'https://i.ibb.co/RG1W9pMN/arvind.png',
                github: 'https://github.com/arvindpatnaik7',
                linkedin: 'https://www.linkedin.com/in/arvind-guggilapu-2b0048259/',
              },
            ].map((person, i) => (
              <div className="text-center" key={i}>
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">{person.name}</h3>
                <p className="text-blue-600 mb-2">{person.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{person.bio}</p>
                <div className="flex justify-center gap-4">
                  <a href={person.github} target="_blank" rel="noopener noreferrer">
                    <Github className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white w-5 h-5" />
                  </a>
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Start Sharing Today</h2>
          <p className="text-xl mb-6 text-blue-100">
            Write about your experience, tools you love, or something new you've built in Java!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-gradient-to-r from-yellow-400 via-pink-300 to-purple-500 text-red-800 hover:opacity-90"
              onClick={handleStartWriting}
            >
              Start Writing
            </Button>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-gradient-to-r from-green-400 via-blue-300 to-indigo-500 text-red-800 border-none hover:opacity-90"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Modals */}
      {showCreateModal && <CreatePost />} {/* ✅ removed `onClose` prop */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default About;
