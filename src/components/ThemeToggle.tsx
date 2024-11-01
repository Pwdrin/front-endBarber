import React from 'react';
import { Moon } from 'lucide-react';

export function ThemeToggle() {
  return (
    <button
      className="p-2 rounded-lg bg-gray-800 text-yellow-400"
      title="Modo escuro ativo"
      disabled
    >
      <Moon className="w-5 h-5" />
    </button>
  );
}