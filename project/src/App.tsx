import React, { useState } from 'react';
import { Menu, X, Home, Library, User, Search } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-pink-100">
      {/* Menu Button */}
      {!isMenuOpen && (
        <button 
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all"
        >
          <Menu className="w-6 h-6 text-pink-800" />
        </button>
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white/30 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } z-40`}>
        <div className="p-4">
          <button 
            onClick={toggleMenu}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-pink-200/50 transition-all"
          >
            <X className="w-6 h-6 text-pink-800" />
          </button>
          
          <div className="mt-16 space-y-4">
            <button 
              onClick={() => {
                setActiveSection('home');
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full p-3 rounded-lg hover:bg-pink-200/50 transition-all text-pink-900"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveSection('library');
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full p-3 rounded-lg hover:bg-pink-200/50 transition-all text-pink-900"
            >
              <Library className="w-5 h-5" />
              <span>Biblioteca</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveSection('account');
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full p-3 rounded-lg hover:bg-pink-200/50 transition-all text-pink-900"
            >
              <User className="w-5 h-5" />
              <span>Conta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-pink-900 mb-4">SomDong</h1>
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Pesquisar mangás..."
                className="w-full px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-900 placeholder-pink-400"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-pink-400" />
            </div>
          </div>

          {/* Featured Manga */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-pink-900 mb-6">Destaques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <img
                    src={`https://source.unsplash.com/random/800x600?manga&${i}`}
                    alt="Manga cover"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-pink-900">Mangá Popular {i}</h3>
                    <p className="text-pink-700 text-sm mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Updates */}
          <div>
            <h2 className="text-2xl font-semibold text-pink-900 mb-6">Últimas Atualizações</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="bg-white/40 backdrop-blur-sm rounded-lg overflow-hidden shadow hover:shadow-lg transition-all">
                  <img
                    src={`https://source.unsplash.com/random/400x600?manga&${i}`}
                    alt="Manga cover"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-pink-900 truncate">Mangá {i}</h3>
                    <p className="text-xs text-pink-700 mt-1">Cap. {Math.floor(Math.random() * 100) + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;