'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{password?: string; confirmPassword?: string}>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (!token) {
      setError('Token de recuperação inválido ou expirado.');
    }
  }, [token]);

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      return 'Senha deve conter pelo menos um caractere especial (@, !, #, $, etc.)';
    }
    if (!/[0-9]/.test(pass)) {
      return 'Senha deve conter pelo menos um número';
    }
    return '';
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

  const validateForm = () => {
    const errors: {password?: string; confirmPassword?: string} = {};
    
    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Senhas não conferem';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!token) {
      setError('Token de recuperação inválido.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword({ token, password });
      setSuccess('Senha redefinida com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Token inválido ou expirado. Solicite um novo link de recuperação.');
      } else if (err.response?.status === 429) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else {
        setError('Ocorreu um erro ao redefinir sua senha. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'password') {
      setPassword(value);
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    } else {
      setConfirmPassword(value);
      setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
    
    if (error) {
      setError(null);
    }
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Card className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Link inválido</h1>
            <p className="text-gray-600">
              O link de recuperação que você usou é inválido ou expirou.
            </p>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-sm text-red-600">
              Solicite um novo link de recuperação de senha.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button variant="primary" className="w-full">
                Solicitar novo link
              </Button>
            </Link>
            
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:underline"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Redefinir senha</h1>
          <p className="text-gray-600">
            Digite sua nova senha abaixo.
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
            <p className="text-xs text-green-600 mt-1">
              Redirecionando para o login...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Input
              label="Nova senha"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => setShowPasswordRequirements(true)}
              className={`text-gray-500 ${fieldErrors.password ? 'border-red-500' : ''}`}
              error={fieldErrors.password}
              disabled={isLoading || !!success}
              required
              autoComplete="new-password"
            />
            
            {password && !fieldErrors.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Força da senha:</span>
                  <span className="text-xs font-medium" style={{ color: passwordStrength?.color.replace('bg-', 'text-') }}>
                    {passwordStrength?.text}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength?.color} transition-all duration-300`}
                    style={{ 
                      width: passwordStrength ? `${(parseInt(passwordStrength.color.match(/\d+/)?.[0] || '0') * 25)}%` : '0%' 
                    }}
                  />
                </div>
              </div>
            )}

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
          </div>

          <div>
            <Input
              label="Confirmar nova senha"
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`text-gray-500 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
              error={fieldErrors.confirmPassword}
              disabled={isLoading || !!success}
              required
              autoComplete="new-password"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            isLoading={isLoading}
            disabled={isLoading || !!success}
          >
            {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm text-blue-600 hover:underline"
          >
            Voltar para o login
          </Link>
        </div>
      </Card>
    </div>
  );
}