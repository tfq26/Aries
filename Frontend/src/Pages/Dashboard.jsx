import React, { useState, useEffect, useMemo } from 'react';
import useDebounce from '../hooks/useDebounce';
import { useNavigate, Link } from 'react-router-dom';
import { getPosts } from '../Api/api';
import { FiSearch, FiFilter, FiPlus, FiClock, FiUser } from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

// ---
// Component for the blog post dashboard
// ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch posts in real-time on component mount
  useEffect(() => {
    const unsubscribe = getPosts(
      (fetchedPosts) => {
        setPosts(fetchedPosts);
        setLoading(false);
      },
      (err) => { // This is the error callback
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const authors = useMemo(() => {
    const uniqueAuthors = [...new Set(posts.map(post => post.authorName))];
    return uniqueAuthors.filter(author => author);
  }, [posts]);

    const filteredPosts = posts.filter(post => {
    const searchMatch = debouncedSearchTerm
      ? (post.title && post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) || 
        (post.content && post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      : true;

    const authorMatch = selectedAuthor 
      ? post.authorName === selectedAuthor
      : true;

    return searchMatch && authorMatch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-aero-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-ncs-600 to-aero-500 bg-clip-text text-transparent">
          AZC Design Society
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover the latest insights, tutorials, and stories from our creative community.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-rich-black-700 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts by title or content..."
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="input-field pl-10 w-full"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
          
          <Link
            to="/create"
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FiPlus className="h-5 w-5" />
            New Post
          </Link>
        </div>
      </div>

      {/* Content Area */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-rich-black-700 rounded-2xl shadow">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No posts found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchTerm || selectedAuthor ? (
              'Try adjusting your search or filter criteria.'
            ) : (
              'Be the first to create a post!'
            )}
          </p>
          <div className="mt-6">
            <Link
              to="/create"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <FiPlus className="h-4 w-4" />
              Create Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt || new Date());
            const formattedDate = format(postDate, 'MMM d, yyyy');
            const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
            
            return (
              <article
                key={post.id}
                className="group bg-white dark:bg-rich-black-600 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-aero-600 dark:group-hover:text-aero-400 transition-colors">
                      {post.title || 'Untitled Post'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.content || 'No content available.'}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-rich-black-500">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiUser className="mr-1.5" />
                        <span>{post.authorName || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center" title={formattedDate}>
                        <FiClock className="mr-1.5" />
                        <time dateTime={postDate.toISOString()}>{timeAgo}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>);
};

export default Dashboard;
