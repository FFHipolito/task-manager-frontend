import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-8">
      <div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          📋 TaskManager
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="text-xl font-bold mb-2">Interface Intuitiva</h3>
          <p className="text-gray-600">Design moderno e fácil de usar</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-xl font-bold mb-2">Rápido e Responsivo</h3>
          <p className="text-gray-600">Construído com as tecnologias mais modernas</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-xl font-bold mb-2">Seguro</h3>
          <p className="text-gray-600">Seus dados sempre protegidos com autenticação JWT</p>
        </div>
      </div>
    </div>
  );
}
