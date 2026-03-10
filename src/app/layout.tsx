import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inventario SantaCruz',
  description: 'Plantilla base de Next.js con arquitectura escalable'
};

type PropiedadesLayout = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: PropiedadesLayout) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
