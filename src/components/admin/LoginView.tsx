import { ShieldCheck, KeyRound, LogIn, Loader2 } from 'lucide-react';
import type { Language } from '../../types';
import { translations } from '../../i18n';
import { Card, Input, Button } from '../ui';

interface LoginViewProps {
  lang: Language;
  username: string;
  password: string;
  error: string;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginView({
  lang,
  username,
  password,
  error,
  loading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginViewProps) {
  const t = translations[lang];

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
      <Card variant="elevated" padding="lg" className="overflow-hidden">
        <div className="bg-slate-900 text-white p-6 border-b-2 border-red-700 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-700 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-white">{t.loginTitle}</h2>
          <p className="text-xs text-slate-300 mt-1">{t.loginSubtitle}</p>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2" role="alert">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Input
              label={t.usernameLabel}
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              required
              autoComplete="username"
              leftIcon={<KeyRound className="w-4 h-4" />}
              placeholder="admin"
            />

            <Input
              label={t.passwordLabel}
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              autoComplete="current-password"
              leftIcon={<LogIn className="w-4 h-4" />}
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>{t.loginSubmitBtn}</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}