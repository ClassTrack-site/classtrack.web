import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input, Badge } from '@/shared/components/ui';
import { authService } from '../services/auth.service';
import { ShieldCheck, Mail, Lock, KeyRound, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos = 300s
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Ingresa tu correo institucional.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authService.forgotPassword(email);
      setStep(2);
      setTimeLeft(300);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error solicitando código. Inténtalo más tarde.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Error enviando código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMessage('El código debe ser de 6 dígitos numéricos.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authService.resetPassword(email, code, newPassword);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Código inválido o expirado. Solicita uno nuevo.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Error restableciendo contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white items-center justify-center shadow-lg shadow-sky-500/25 mb-1">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recuperar Acceso</h1>
          <p className="text-xs text-slate-500 font-medium">
            {step === 1 ? 'Te enviaremos un código de seguridad' : 'Ingresa el código numérico recibido'}
          </p>
        </div>

        <Card className="shadow-lg shadow-black/[0.03] border-black/[0.04] p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center space-y-3 py-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-[#16A34A] mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">¡Contraseña restablecida!</p>
              <p className="text-xs text-slate-500">Redirigiendo al login...</p>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Correo Electrónico Registrado"
                type="email"
                placeholder="ejemplo@sanjose.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold mt-2"
                isLoading={isLoading}
              >
                Enviar Código de 6 Dígitos
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                  Volver al Login
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex items-center justify-between p-2.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs">
                <div className="flex items-center gap-1.5 text-sky-800 font-medium">
                  <Clock className="h-4 w-4 text-sky-600" />
                  <span>Código enviado a {email}</span>
                </div>
                <Badge variant={timeLeft > 60 ? 'sky' : 'absent'} size="sm">
                  {formatTime(timeLeft)}
                </Badge>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Código de 6 Dígitos"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                leftIcon={<KeyRound className="h-4 w-4" />}
                className="text-center font-bold tracking-widest text-lg"
                required
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                Actualizar Contraseña
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
