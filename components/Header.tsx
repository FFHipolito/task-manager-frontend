'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import Button from './Button';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          📋 TaskManager
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-gray-700 hover:text-blue-600">
                Tarefas
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{user?.name}</span>
                <Button variant="danger" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Registrar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
