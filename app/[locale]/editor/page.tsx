import Editor3D from '../../components/editor/Editor3D';
import { useTranslations } from 'next-intl';

export default function EditorPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      <Editor3D />
    </main>
  );
} 