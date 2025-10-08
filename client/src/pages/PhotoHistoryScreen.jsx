import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PhotoHistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveTypeFilter, setSaveTypeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('photoHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const getFilteredAndSortedHistory = () => {
    let filtered = [...history];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.customName && item.customName.toLowerCase().includes(search)) ||
        (item.fileName && item.fileName.toLowerCase().includes(search)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(search))) ||
        (item.analysisData.seasonMatch && item.analysisData.seasonMatch.toLowerCase().includes(search)) ||
        (item.analysisData.detectedStyle && item.analysisData.detectedStyle.toLowerCase().includes(search))
      );
    }

    // Apply score filter
    if (filter !== 'all') {
      if (filter === 'high') {
        filtered = filtered.filter(item => item.analysisData.overallScore >= 80);
      } else if (filter === 'medium') {
        filtered = filtered.filter(item => item.analysisData.overallScore >= 60 && item.analysisData.overallScore < 80);
      } else if (filter === 'low') {
        filtered = filtered.filter(item => item.analysisData.overallScore < 60);
      }
    }

    // Apply save type filter
    if (saveTypeFilter !== 'all') {
      if (saveTypeFilter === 'auto') {
        filtered = filtered.filter(item => item.autoSaved === true);
      } else if (saveTypeFilter === 'manual') {
        filtered = filtered.filter(item => item.autoSaved === false);
      }
    }

    // Apply sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => b.analysisData.overallScore - a.analysisData.overallScore);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.customName || a.fileName).localeCompare(b.customName || b.fileName));
    }

    return filtered;
  };

  const handleDelete = (id) => {
    if (confirm('Delete this analysis from history?')) {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem('photoHistory', JSON.stringify(updated));
    }
  };

  const handleViewDetails = (item) => {
    navigate('/analysis', {
      state: {
        image: item.image,
        fileName: item.fileName,
      },
    });
  };

  const stats = {
    total: history.length,
    avgScore: history.length > 0 
      ? Math.round(history.reduce((sum, item) => sum + item.analysisData.overallScore, 0) / history.length)
      : 0,
    highScore: history.length > 0
      ? Math.max(...history.map(item => item.analysisData.overallScore))
      : 0,
  };

  // Get all unique tags
  const allTags = [...new Set(history.flatMap(item => item.tags || []))];

  const filteredHistory = getFilteredAndSortedHistory();

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-7xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-4 font-display"
        >
          Photo History
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-purple-200 text-center mb-12"
        >
          Review your past style analyses
        </motion.p>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{stats.total}</div>
            <div className="text-purple-200">Total Analyses</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{stats.avgScore}</div>
            <div className="text-purple-200">Average Score</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{stats.highScore}</div>
            <div className="text-purple-200">Highest Score</div>
          </div>
        </motion.div>

        {/* Popular Tags */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 bg-purple-500 bg-opacity-30 text-purple-200 text-sm rounded-full hover:bg-opacity-50 transition-colors"
                >
                  #{tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 mb-6"
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, tags, season, or style..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-200">
              🔍
            </div>
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-3">
                <span className="text-white font-semibold">Score:</span>
                {['all', 'high', 'medium', 'low'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === f
                        ? 'bg-white text-purple-600 font-semibold'
                        : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'high' ? '80+' : f === 'medium' ? '60-79' : '<60'}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <span className="text-white font-semibold">Type:</span>
                {['all', 'auto', 'manual'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSaveTypeFilter(f)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      saveTypeFilter === f
                        ? 'bg-white text-purple-600 font-semibold'
                        : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'auto' ? 'Auto' : 'Manual'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <span className="text-white font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white focus:outline-none focus:border-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="date" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Date (Newest)</option>
                <option value="score" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Score (Highest)</option>
                <option value="name" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Name (A-Z)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* History Grid */}
        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 text-center"
          >
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-white mb-2">No History Yet</h3>
            <p className="text-purple-200 mb-6">Start analyzing photos to build your history</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="btn-primary bg-white text-purple-600"
            >
              Upload Photo
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(item)}
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-3 py-1 rounded-full">
                    <span className="text-white font-bold text-lg">
                      {item.analysisData.overallScore}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold truncate flex-1">
                      {item.customName || item.fileName}
                    </h3>
                    {item.autoSaved && (
                      <span className="px-2 py-1 bg-blue-500 bg-opacity-30 text-blue-200 text-xs rounded-full">
                        Auto
                      </span>
                    )}
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-purple-500 bg-opacity-30 text-purple-200 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mb-3">
                    {item.analysisData.dominantColors?.slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="text-sm text-purple-200 mb-3">
                    <div>Season: <span className="text-white font-semibold">{item.analysisData.seasonMatch}</span></div>
                    <div>Style: <span className="text-white font-semibold">{item.analysisData.detectedStyle}</span></div>
                  </div>

                  <div className="text-xs text-purple-200">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item);
                      }}
                      className="flex-1 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg text-sm hover:bg-opacity-30 transition-colors"
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="px-3 py-2 bg-red-500 bg-opacity-20 text-red-300 rounded-lg text-sm hover:bg-opacity-30 transition-colors"
                    >
                      🗑️
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoHistoryScreen;
