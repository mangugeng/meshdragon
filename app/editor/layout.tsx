import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MeshDragon Editor',
  description: 'MeshDragon - 3D Model Editor',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://unpkg.com/three@0.159.0/build/three.min.js"></script>
        <script async src="https://unpkg.com/three@0.159.0/examples/js/controls/OrbitControls.js"></script>
        <script async src="https://unpkg.com/three@0.159.0/examples/js/controls/TransformControls.js"></script>
        <script async src="https://unpkg.com/three@0.159.0/examples/js/loaders/GLTFLoader.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 