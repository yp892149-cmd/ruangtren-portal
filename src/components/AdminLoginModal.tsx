import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { AdminUser } from '../types/index.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser, token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      // Fetch allowed emails list for verification helper
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.settings?.adminEmails) {
            setAllowedEmails(data.settings.adminEmails);
          } else {
            setAllowedEmails(['yp892149@gmail.com', 'rullganteng987@gmail.com']);
          }
        })
        .catch(() => {
          setAllowedEmails(['yp892149@gmail.com', 'rullganteng987@gmail.com']);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthenticate = async (targetEmail: string, targetName?: string) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName || 'Pemilik RUANGTREN',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Autentikasi gagal. Akun Google tidak memiliki izin akses.');
      }

      // Store in localStorage for seamless persistence
      localStorage.setItem('ruangtren_admin_token', data.token);
      localStorage.setItem('ruangtren_admin_user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat verifikasi Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Silakan masukkan alamat Gmail Anda.');
      return;
    }
    handleAuthenticate(emailInput.trim(), nameInput.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Portal Masuk Administrator</h2>
              <p className="text-xs text-slate-400">Verifikasi Google OAuth 2.0 RUANGTREN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Akses Ditolak</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-600 leading-relaxed bg-blue-50/70 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900 font-semibold block">Keamanan Akun Google Tunggal:</strong>
              Website ini tidak menggunakan password buatan. Hanya akun Gmail pemilik yang telah diotorisasi dalam server yang dapat mengakses CMS Studio.
            </div>
          </div>

          {/* Quick Authorized One-Click Login for Verified Owner Emails */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Login Akun Pemilik Terverifikasi:
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleAuthenticate('yp892149@gmail.com', 'Pemilik RUANGTREN')}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold text-slate-900 text-[11px]">
                    G
                  </div>
                  <span>Masuk sebagai yp892149@gmail.com</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAuthenticate('rullganteng987@gmail.com', 'Pemilik RUANGTREN')}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[11px]">
                    G
                  </div>
                  <span>Masuk sebagai rullganteng987@gmail.com</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-3 text-[11px] text-slate-400 uppercase font-medium">
              Atau Uji Akun Lain
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form for custom Gmail test */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat Gmail Administrator
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Alamat yang tidak terdaftar akan otomatis ditolak oleh proteksi server.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-1">⟳</span>
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>Verifikasi & Masuk Dashboard</span>
            </button>
          </form>

          {/* Whitelist Info Notice */}
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Pengunjung biasa dilarang mengakses halaman ini demi integritas redaksi.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
