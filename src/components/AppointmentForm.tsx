import React, { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import type { Barber, Service } from '../types';

interface AppointmentFormProps {
  onSubmit: (data: {
    name: string;
    phone: string;
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
  }) => void;
  isLoading?: boolean;
}

export function AppointmentForm({ onSubmit, isLoading = false }: AppointmentFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadBarbers();
    loadServices();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await api.getBarbers();
      setBarbers(data);
    } catch (error) {
      toast.error('Erro ao carregar barbeiros');
    }
  };

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!selectedBarberId) {
      toast.error('Selecione um barbeiro');
      return;
    }
    if (!selectedServiceId) {
      toast.error('Selecione um serviço');
      return;
    }
    if (!selectedDate) {
      toast.error('Selecione uma data');
      return;
    }
    if (!selectedTime) {
      toast.error('Selecione um horário');
      return;
    }

    onSubmit({
      name,
      phone,
      barberId: selectedBarberId,
      serviceId: selectedServiceId,
      date: selectedDate,
      time: selectedTime,
    });

    // Reset form
    setName('');
    setPhone('');
    setSelectedBarberId('');
    setSelectedServiceId('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Scissors className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Novo Agendamento</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Cliente *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o nome do cliente"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="barber" className="block text-sm font-medium text-gray-700 mb-1">
            Barbeiro *
          </label>
          <select
            id="barber"
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Selecione um barbeiro</option>
            {barbers.map((barber) => (
              <option key={barber._id} value={barber._id}>
                {barber.user?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Serviço *
          </label>
          <select
            id="service"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - R$ {service.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data *
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Horário *
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Selecione um horário</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Scissors className="w-4 h-4" />
          {isLoading ? 'Agendando...' : 'Agendar Corte'}
        </button>
      </form>
    </div>
  );
}