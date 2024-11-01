import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../services/api';
import type { Appointment, Barber, Service } from '../types';
import toast from 'react-hot-toast';
import { 
  createDateWithBrazilianTimezone, 
  formatDateToBrazilian, 
  isValidDate,
  parseAndAdjustDate 
} from '../utils/date';

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function EditAppointmentModal({ 
  appointment, 
  onClose, 
  onSave 
}: EditAppointmentModalProps) {
  const [barberId, setBarberId] = useState(
    typeof appointment.barberId === 'object' ? appointment.barberId._id : appointment.barberId
  );
  const [serviceId, setServiceId] = useState(
    typeof appointment.serviceId === 'object' ? appointment.serviceId._id : appointment.serviceId
  );
  const [date, setDate] = useState('');
  const [time, setTime] = useState(appointment.time);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeConflict, setTimeConflict] = useState(false);

  useEffect(() => {
    // Initialize date from appointment
    const appointmentDate = createDateWithBrazilianTimezone(date);
    if (isValidDate(appointmentDate)) {
      setDate(format(appointmentDate, 'yyyy-MM-dd'));
    }
    
    loadBarbers();
    loadServices();
  }, [appointment.date]);

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
    if (!date || !time || !barberId) return true;

    try {
      const { available } = await api.checkAvailability({
        barberId,
        date,
        time,
        excludeAppointmentId: appointment._id
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

      const service = services.find(s => s._id === serviceId);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }

      // Create date in Brazilian timezone
      const appointmentDate = createDateWithBrazilianTimezone(date);
      
      const updateData = {
        barberId,
        serviceId,
        date: appointmentDate.toISOString(),
        time,
        revenue: service.price,
        clientId: typeof appointment.clientId === 'object' 
          ? appointment.clientId._id 
          : appointment.clientId
      };

      await onSave(updateData);
      toast.success('Agendamento atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Editar Agendamento</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="barber" className="block text-sm font-medium text-gray-700 mb-1">
              Barbeiro
            </label>
            <select
              id="barber"
              value={barberId}
              onChange={(e) => {
                setBarberId(e.target.value);
                checkTimeAvailability();
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            >
              {barbers.map((barber) => (
                <option key={barber._id} value={barber._id}>
                  {barber.user?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Serviço
            </label>
            <select
              id="service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            >
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - R$ {service.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setDate(newDate);
                  checkTimeAvailability();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
                required
              />
              {date && (
                <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">
                    {formatDateToBrazilian(parseISO(date))}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Horário
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                checkTimeAvailability();
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                timeConflict ? 'border-yellow-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              required
            >
              {availableTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
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
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || timeConflict}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}