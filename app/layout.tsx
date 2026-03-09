import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Ajuste · Préqualification sur mesure',
  description: 'Configurateur premium de préqualification pour mobilier sur mesure.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
