'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: '',
      }));
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Senha deve conter pelo menos um caractere especial (@, !, #, $, etc.)';
    }
    if (!/[0-9]/.test(password)) {
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
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: 'Este email já está cadastrado'
        }));
      } else if (err.response?.status === 400) {
        setErrors(prev => ({
          ...prev,
          ...err.response.data.errors
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se ao Task Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Input
              label="Nome"
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              required
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? 'border-red-500' : ''}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordRequirements(true)}
              required
              className={errors.password ? 'border-red-500' : ''}
              disabled={isLoading}
              autoComplete="new-password"
            />
            
            {formData.password && !errors.password && (
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
                  <li className={formData.password.length >= 6 ? 'text-green-600' : 'text-gray-600'}>
                    {formData.password.length >= 6 ? '✓' : '•'} Pelo menos 6 caracteres
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '•'} Pelo menos uma letra maiúscula
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '•'} Pelo menos um caractere especial (@, !, #, $, etc.)
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                    {/[0-9]/.test(formData.password) ? '✓' : '•'} Pelo menos um número
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <Input
              label="Confirmar Senha"
              type="password"
              name="confirmPassword"
              placeholder="••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={errors.confirmPassword ? 'border-red-500' : ''}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Já tem conta?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:underline font-semibold"
            >
              Faça login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}