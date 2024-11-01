import React from 'react';
import { Scissors, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const isAdminPage = location.pathname === '/admin';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <Scissors className="w-6 h-6" />
            <span className="text-xl font-bold">Barbearia Style</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </>
            )}
            
            {!isAdminPage && (
              <button
                onClick={handleAdminAccess}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Área Administrativa</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}