import { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';

export function SuperAdminShell({
  title,
  subtitle,
  actions,
  active,
  children
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar activeItem={active} />
      <TopBar />
      <main className="ml-0 md:ml-64 pt-20 px-4 md:px-8 pb-8 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, hint, tone = 'blue' }: { label: string; value: string | number; hint?: string; tone?: 'blue' | 'green' | 'amber' | 'red' | 'gray' }) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-700'
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`inline-block px-2 py-0.5 rounded text-[11px] ${tones[tone]}`}>{label}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  );
}
