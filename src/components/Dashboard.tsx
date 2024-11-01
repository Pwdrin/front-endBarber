import React, { useMemo } from 'react';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { format, startOfToday, endOfToday, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment } from '../types';

interface DashboardProps {
  appointments: Appointment[];
}

export function Dashboard({ appointments }: DashboardProps) {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const todayAppointments = appointments.filter(
      app => {
        const appDate = new Date(app.date);
        return appDate >= todayStart && appDate <= todayEnd;
      }
    );

    const monthlyAppointments = appointments.filter(
      app => {
        const appDate = new Date(app.date);
        return appDate >= monthStart && appDate <= monthEnd;
      }
    );

    const dailyRevenue = todayAppointments
      .filter(app => app.completed)
      .reduce((total, app) => total + app.revenue, 0);

    const monthlyRevenue = monthlyAppointments
      .filter(app => app.completed)
      .reduce((total, app) => total + app.revenue, 0);

    // Calculate weekly stats
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayAppointments = appointments.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= dayStart && appDate <= dayEnd;
      });

      return {
        date: date.toISOString(),
        clients: dayAppointments.length
      };
    }).reverse();

    return {
      dailyClients: todayAppointments.length,
      dailyRevenue,
      monthlyRevenue,
      weeklyStats
    };
  }, [appointments]);

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Clientes Hoje"
          value={stats.dailyClients}
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          title="Receita Hoje"
          value={`R$ ${stats.dailyRevenue.toFixed(2)}`}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          title="Receita (30 dias)"
          value={`R$ ${stats.monthlyRevenue.toFixed(2)}`}
        />
      </div>

      {/* Weekly Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Clientes por Dia</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[500px]">
            {stats.weeklyStats.map((stat) => (
              <div key={stat.date} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600">
                  {format(new Date(stat.date), 'EEE', { locale: ptBR })}
                </div>
                <div className="mt-2 text-xl md:text-2xl font-semibold text-gray-800">
                  {stat.clients}
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(stat.date), 'dd/MM')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}