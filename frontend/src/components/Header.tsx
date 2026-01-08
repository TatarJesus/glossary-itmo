import type { Metadata } from '../types';

interface HeaderProps {
  metadata: Metadata | null;
}

export function Header({ metadata }: HeaderProps) {
  return (
    <header className="header">
      <h1>{metadata?.title || 'Глоссарий терминов'}</h1>
      <p>{metadata?.topic}</p>
    </header>
  );
}
