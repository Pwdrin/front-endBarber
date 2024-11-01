import React, { useState } from 'react';
import type { Service } from '../../types';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface ServiceFormProps {
  onSuccess: () => void;
  initialData?: Service | null;
}

export function ServiceForm({ onSuccess, initialData }: ServiceFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [duration, setDuration] = useState(initialData?.duration?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !duration) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      if (initialData) {
        await api.updateService(initialData._id, {
          name,
          price: Number(price),
          duration: Number(duration),
          description
        });
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await api.createService({
          name,
          price: Number(price),
          duration: Number(duration),
          description
        });
        toast.success('Serviço cadastrado com sucesso!');
      }
      
      onSuccess();
      
      if (!initialData) {
        setName('');
        setPrice('');
        setDuration('');
        setDescription('');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar serviço');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Serviço *
        </label>
        <input
          type="text"
          id="serviceName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          disabled={isLoading}
          placeholder="Ex: Corte Degradê"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Preço (R$) *
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          disabled={isLoading}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Duração (minutos) *
        </label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
          disabled={isLoading}
          placeholder="30"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
          disabled={isLoading}
          placeholder="Descreva os detalhes do serviço..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-medium text-lg"
      >
        {isLoading ? 'Processando...' : initialData ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
      </button>
    </form>
  );
}