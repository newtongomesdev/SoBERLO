import React, { useState } from 'react';
import { TranslationKey } from '../i18n';
import { GoogleIcon } from './icons';

interface AuthProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (email: string, password: string) => boolean;
  onGoogleLogin: () => void;
  t: (key: TranslationKey) => string;
  isModal?: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, onGoogleLogin, t, isModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const success = isLogin ? onLogin(email, password) : onSignup(email, password);
    
    if (!success) {
      setError(isLogin ? 'Invalid credentials or user not found.' : 'User already exists with this email.');
    }
  };

  return (
    <div className={`${isModal ? '' : 'min-h-screen bg-slate-50 dark:bg-slate-950'} flex items-center justify-center p-4 transition-colors duration-500`}>
      <div className={`max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl ${isModal ? '' : 'shadow-xl border border-transparent dark:border-slate-800'} p-8 space-y-6`}>
        <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h1 className="text-3xl font-black tracking-tight text-brand-dark dark:text-white">SoBERLO</h1>
            </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isLogin ? t('loginTitle') : t('signupTitle')}</h2>
        </div>

        <div>
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all"
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              {t('googleLoginButton')}
            </button>
        </div>

        <div className="flex items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">{t('orDivider')}</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          <div>
            <label htmlFor="email" className="text-sm font-black text-slate-700 dark:text-slate-300 block mb-2">{t('emailLabel')}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-black text-slate-700 dark:text-slate-300 block mb-2">{t('passwordLabel')}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-black text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all transform hover:-translate-y-0.5"
            >
              {isLogin ? t('loginButton') : t('signupButton')}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-bold text-sm text-brand-primary dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
            {isLogin ? t('switchToSignup') : t('switchToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;