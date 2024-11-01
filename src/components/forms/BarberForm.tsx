import React, { useState } from 'react';
import type { Barber } from '../../types';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface BarberFormProps {
  onSuccess: () => void;
  initialData?: Barber | null;
}

export function BarberForm({ onSuccess, initialData }: BarberFormProps) {
  const [name, setName] = useState(initialData?.user?.name || '');
  const [email, setEmail] = useState(initialData?.user?.email || '');
  const [password, setPassword] = useState('');
  const [specialties, setSpecialties] = useState(initialData?.specialties?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || (!initialData && !password)) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      if (initialData) {
        await api.updateBarber(initialData._id, {
          name,
          email,
          password: password || undefined,
          specialties: specialties.split(',').map(s => s.trim()).filter(Boolean)
        });
        toast.success('Barbeiro atualizado com sucesso!');
      } else {
        await api.createBarber({
          name,
          email,
          password,
          specialties: specialties.split(',').map(s => s.trim()).filter(Boolean)
        });
        toast.success('Barbeiro cadastrado com sucesso!');
      }
      
      onSuccess();
      
      if (!initialData) {
        setName('');
        setEmail('');
        setPassword('');
        setSpecialties('');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar barbeiro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          disabled={isLoading}
          placeholder="Nome completo"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          disabled={isLoading}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Senha {!initialData && '*'}
          {initialData && <span className="text-gray-500 text-xs">(deixe em branco para manter a atual)</span>}
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          disabled={isLoading}
          placeholder="Mínimo 6 caracteres"
          required={!initialData}
        />
      </div>

      <div>
        <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-2">
          Especialidades (separadas por vírgula)
        </label>
        <input
          type="text"
          id="specialties"
          value={specialties}
          onChange={(e) => setSpecialties(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          placeholder="Corte masculino, Barba, Platinado..."
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-medium text-lg"
      >
        {isLoading ? 'Processando...' : initialData ? 'Atualizar Barbeiro' : 'Cadastrar Barbeiro'}
      </button>
    </form>
  );
}