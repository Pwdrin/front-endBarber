import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Scissors, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Barber, Service, BarberStats } from '../types';
import { BarberForm } from './forms/BarberForm';
import { ServiceForm } from './forms/ServiceForm';
import { EditBarberModal } from './modals/EditBarberModal';
import { EditServiceModal } from './modals/EditServiceModal';
import toast from 'react-hot-toast';

const formatPrice = (price: number | undefined): string => {
  if (typeof price !== 'number') return 'R$ 0,00';
  return `R$ ${price.toFixed(2)}`;
};

export function ManagementForms() {
  const [showBarberForm, setShowBarberForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, BarberStats>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadBarbers(),
        loadServices(),
        loadBarberStats()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBarbers = async () => {
    try {
      const data = await api.getBarbers();
      setBarbers(data);
    } catch (error) {
      console.error('Error loading barbers:', error);
      toast.error('Erro ao carregar barbeiros');
      setBarbers([]);
    }
  };

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Erro ao carregar serviços');
      setServices([]);
    }
  };

  const loadBarberStats = async () => {
    try {
      const data = await api.getBarberStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading barber stats:', error);
      toast.error('Erro ao carregar estatísticas');
      setStats({});
    }
  };

  const handleDeleteBarber = async (barberId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este barbeiro?')) return;

    try {
      await api.deleteBarber(barberId);
      toast.success('Barbeiro excluído com sucesso!');
      await loadBarbers();
    } catch (error) {
      console.error('Error deleting barber:', error);
      toast.error('Erro ao excluir barbeiro');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await api.deleteService(serviceId);
      toast.success('Serviço excluído com sucesso!');
      await loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir serviço');
    }
  };

  const handleSuccess = async () => {
    await loadInitialData();
    setShowBarberForm(false);
    setShowServiceForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-blue-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barbers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Barbeiros</h2>
          <button
            onClick={() => setShowBarberForm(!showBarberForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showBarberForm ? (
              <>
                <Scissors className="w-4 h-4" />
                Fechar Formulário
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Novo Barbeiro
              </>
            )}
          </button>
        </div>

        {showBarberForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <BarberForm onSuccess={handleSuccess} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <div key={barber._id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {barber.user?.name || 'Nome não disponível'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBarber(barber)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBarber(barber._id)}
                    className="text-red-600 hover:text-red-700"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>{barber.user?.email || 'Email não disponível'}</p>
                {barber.specialties && barber.specialties.length > 0 && (
                  <p className="mt-1">
                    <span className="font-medium">Especialidades:</span>{' '}
                    {barber.specialties.join(', ')}
                  </p>
                )}
              </div>

              {/* Stats Section */}
              {stats[barber._id] && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Agendamentos</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {stats[barber._id].monthlyAppointments}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Concluídos</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {stats[barber._id].completedAppointments}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs">Receita</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      {formatPrice(stats[barber._id].revenue)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Serviços</h2>
          <button
            onClick={() => setShowServiceForm(!showServiceForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showServiceForm ? (
              <>
                <Scissors className="w-4 h-4" />
                Fechar Formulário
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Novo Serviço
              </>
            )}
          </button>
        </div>

        {showServiceForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <ServiceForm onSuccess={handleSuccess} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service._id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="text-red-600 hover:text-red-700"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(service.price)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Duração:</span> {service.duration || 0} minutos
                </p>
                {service.description && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Descrição:</span> {service.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Modals */}
      {editingBarber && (
        <EditBarberModal
          barber={editingBarber}
          onClose={() => setEditingBarber(null)}
          onSuccess={handleSuccess}
        />
      )}

      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}