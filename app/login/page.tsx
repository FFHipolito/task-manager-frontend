'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string}>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido';
    }
    
    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else {
      if (password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      else if (!/[A-Z]/.test(password)) {
        errors.password = 'Senha deve conter pelo menos uma letra maiúscula';
      }
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = 'Senha deve conter pelo menos um caractere especial (@, !, #, $, etc.)';
      }
      else if (!/[0-9]/.test(password)) {
        errors.password = 'Senha deve conter pelo menos um número';
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    
    if (strength === 0) return { text: 'Muito fraca', color: 'bg-red-500' };
    if (strength === 1) return { text: 'Fraca', color: 'bg-orange-500' };
    if (strength === 2) return { text: 'Média', color: 'bg-yellow-500' };
    if (strength === 3) return { text: 'Forte', color: 'bg-green-500' };
    return { text: 'Muito forte', color: 'bg-green-600' };
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowPasswordRequirements(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login({ email, password });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Email ou senha incorretos. Por favor, tente novamente.');
        setShowPasswordRequirements(true);
      } else if (err.response?.status === 404) {
        setError('Usuário não encontrado. Verifique seu email.');
      } else if (err.response?.status === 429) {
        setError('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError('Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.');
      }
      
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value);
      setFieldErrors(prev => ({ ...prev, email: undefined }));
    } else {
      setPassword(value);
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
    
    if (error) {
      setError(null);
    }
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600">Acesse sua conta Task Manager</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`text-gray-500 ${fieldErrors.email ? 'border-red-500' : ''}`}
              error={fieldErrors.email}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`text-gray-500 ${fieldErrors.password ? 'border-red-500' : ''}`}
              error={fieldErrors.password}
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
            
            {showPasswordRequirements && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  ⚠️ Sua senha deve conter:
                </p>
                <ul className="text-xs space-y-1">
                  <li className={password.length >= 6 ? 'text-green-600' : 'text-gray-600'}>
                    {password.length >= 6 ? '✓' : '•'} Pelo menos 6 caracteres
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                    {/[A-Z]/.test(password) ? '✓' : '•'} Pelo menos uma letra maiúscula
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '•'} Pelo menos um caractere especial (@, !, #, $, etc.)
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                    {/[0-9]/.test(password) ? '✓' : '•'} Pelo menos um número
                  </li>
                </ul>
              </div>
            )}
            
            <div className="text-right mt-3">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Não tem conta?{' '}
            <Link 
              href="/register" 
              className="text-blue-600 hover:underline font-semibold"
            >
              Registre-se
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}