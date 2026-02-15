'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const { forgotPassword } = useAuth();

  const validateEmail = () => {
    if (!email) {
      setFieldError('Email é obrigatório');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError('Email inválido');
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validateEmail()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await forgotPassword({ email });
      setSuccess('Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada.');
      setEmail(''); 
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Email não encontrado. Verifique se você digitou corretamente.');
      } else if (err.response?.status === 429) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFieldError(undefined);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h1>
          <p className="text-gray-600">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={handleEmailChange}
              className={`text-gray-500 ${fieldError ? 'border-red-500' : ''}`}
              error={fieldError}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:underline"
            >
              Voltar para o login
            </Link>
          </div>
          
          <div className="text-center border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-600">
              Não tem conta?{' '}
              <Link 
                href="/register" 
                className="text-blue-600 hover:underline font-semibold"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>💡 Dica de segurança:</strong> Verifique sua pasta de spam se não encontrar o email em alguns minutos.
          </p>
        </div>
      </Card>
    </div>
  );
}