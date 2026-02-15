'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import Button from './Button';
import { LayoutDashboard, CheckSquare, LogOut, LogIn, UserPlus, ClipboardList } from 'lucide-react';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <ClipboardList className="w-8 h-8" />
          <span>TaskManager</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <Link 
                href="/tasks" 
                className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                <CheckSquare className="w-5 h-5" />
                Tarefas
              </Link>
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-200">
                <span className="text-gray-700 font-medium">{user?.name}</span>
                <Button variant="danger" size="sm" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Registrar
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}