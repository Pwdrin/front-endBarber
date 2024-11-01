import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Calendar } from 'lucide-react';
import { api } from '../services/api';
import type { Barber, Service } from '../types';
import toast from 'react-hot-toast';
import { formatDateToBrazilian, createDateWithBrazilianTimezone } from '../utils/date';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeConflict, setTimeConflict] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBarbers();
      loadServices();
    }
  }, [isOpen]);

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

  const checkTimeAvailability = async () => {
    if (!selectedDate || !selectedTime || !selectedBarberId) return true;

    try {
      const { available } = await api.checkAvailability({
        barberId: selectedBarberId,
        date: selectedDate,
        time: selectedTime
      });
      
      setTimeConflict(!available);
      return available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isAvailable = await checkTimeAvailability();
      if (!isAvailable) {
        toast.error('Horário já está ocupado');
        setIsLoading(false);
        return;
      }

      // Create client and appointment
      const client = await api.createClient({
        name,
        phone
      });

      const service = services.find(s => s._id === selectedServiceId);
      if (!service) throw new Error('Serviço não encontrado');

      const appointmentDate = createDateWithBrazilianTimezone(selectedDate);

      await api.createAppointment({
        clientId: client._id,
        barberId: selectedBarberId,
        serviceId: selectedServiceId,
        date: appointmentDate.toISOString(),
        time: selectedTime,
        revenue: service.price
      });

      toast.success('Agendamento realizado com sucesso!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Erro ao criar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setSelectedBarberId('');
    setSelectedServiceId('');
    setSelectedDate('');
    setSelectedTime('');
    setTimeConflict(false);
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Agendar Horário</h2>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Seu nome completo"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
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
              onChange={(e) => {
                setSelectedBarberId(e.target.value);
                checkTimeAvailability();
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
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
              required
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
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                checkTimeAvailability();
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              required
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
              onChange={(e) => {
                setSelectedTime(e.target.value);
                checkTimeAvailability();
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                timeConflict ? 'border-yellow-500' : 'border-gray-300'
              }`}
              required
              disabled={isLoading}
            >
              <option value="">Selecione um horário</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {timeConflict && (
              <div className="mt-1 flex items-center gap-1 text-yellow-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Este horário já está reservado</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || timeConflict}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {isLoading ? 'Agendando...' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}