import Link from 'next/link';
import Button from '@/components/Button';
import { ClipboardList, Sparkles, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-8">
      <div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-400 mb-4 flex items-center justify-center gap-3">
          <ClipboardList className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
          TaskManager
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Gerencie suas tarefas de forma simples, rápida e eficiente. Mantenha o controle do seu dia a dia.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="outline" size="lg">
            Fazer Login
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="lg">
            Começar Agora
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl text-gray-600">
        <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="mb-4 p-3 bg-blue-50 rounded-full">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Interface Intuitiva</h3>
          <p>Design moderno e fácil de usar</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="mb-4 p-3 bg-yellow-50 rounded-full">
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rápido e Responsivo</h3>
          <p>Construído com as tecnologias mais modernas</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="mb-4 p-3 bg-green-50 rounded-full">
            <Shield className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Seguro</h3>
          <p>Seus dados sempre protegidos com autenticação JWT</p>
        </div>
      </div>
    </div>
  );
}
