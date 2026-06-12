import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const logoFatec = "/logo-fatec.png";
const logoCps = "/logo-cps.png";

interface AuthLayoutProps {
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  footerLink?: {
    href: string;
    label: string;
  };
}

export default function AuthLayout({ title, subtitle, children, footer, footerLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#f7f5f2_0%,#eef1f3_100%)]">
      <header className="bg-white/95 backdrop-blur shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex items-center gap-3 sm:gap-4">
          <img src={logoFatec} alt="FATEC Jacareí" className="h-9 sm:h-12 object-contain" />
          <div className="w-px h-8 bg-gray-300 hidden sm:block" />
          <img src={logoCps} alt="Centro Paula Souza" className="h-7 sm:h-10 object-contain hidden sm:block" />
        </div>
        {footerLink && (
          <Link to={footerLink.href} className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#8B0000] transition-colors">
            {footerLink.label}
          </Link>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-[23rem] sm:max-w-md">
          <div className="mb-5 text-center">
            <h1 className="text-2xl sm:text-[28px] font-black text-gray-800 leading-tight">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          <div className="bg-[#8B0000] text-white rounded-xl shadow-[0_18px_45px_rgba(31,41,55,0.18)] border border-[#7a0000] p-5 sm:p-6">
            {children}
          </div>
        </div>
      </main>

      {footer && <div className="px-4 pb-4 sm:pb-5">{footer}</div>}
    </div>
  );
}
