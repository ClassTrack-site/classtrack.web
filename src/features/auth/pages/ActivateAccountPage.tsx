import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, Button, Input } from '@/shared/components/ui';
import { authService } from '../services/auth.service';
import { KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ActivateAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('Token de activación faltante o inválido.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authService.activate(token, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'El enlace de activación caducó (más de 48h) o es inválido.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Error activando la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white items-center justify-center shadow-lg shadow-sky-500/25 mb-1">
            <KeyRound className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Activa tu Cuenta</h1>
          <p className="text-xs text-slate-500 font-medium">Define tu contraseña institucional inicial</p>
        </div>

        <Card className="shadow-lg shadow-black/[0.03] border-black/[0.04] p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center space-y-3 py-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-[#16A34A] mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">¡Cuenta activada con éxito!</p>
              <p className="text-xs text-slate-500">Redirigiendo a la pantalla de inicio de sesión...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold mt-2"
                isLoading={isLoading}
              >
                Activar e Ingresar
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                  Volver al Login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
