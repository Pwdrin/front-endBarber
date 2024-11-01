import React, { useEffect, useState } from "react";
import { AppointmentForm } from "./AppointmentForm";
import { Dashboard } from "./Dashboard";
import { AppointmentList } from "./AppointmentList";
import { ManagementForms } from "./ManagementForms";
import { api } from "../services/api";
import type { Appointment } from "../types";
import toast from "react-hot-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";
import { Users } from "lucide-react";

export function MainPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "management">(
    "dashboard"
  );

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Erro ao carregar agendamentos");
    }
  };


  const handleAppointmentSubmit = async (data: {
    name: string;
    phone: string;
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
  }) => {
    setIsLoading(true);
    try {
      const client = await api.createClient({
        name: data.name,
        phone: data.phone,
      });

      const services = await api.getServices();
      const service = services.find((s) => s._id === data.serviceId);
      if (!service) throw new Error("Serviço não encontrado");

      await api.createAppointment({
        clientId: client._id,
        barberId: data.barberId,
        serviceId: data.serviceId,
        date: data.date,
        time: data.time,
        revenue: service.price,
      });

      toast.success("Agendamento realizado com sucesso!");
      loadAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await api.completeAppointment(appointmentId);
      toast.success("Agendamento marcado como concluído!");
      loadAppointments();
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Erro ao concluir agendamento");
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await api.deleteAppointment(appointmentId);
      toast.success("Agendamento excluído com sucesso!");
      loadAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Erro ao excluir agendamento");
    }
  };

  const handleEditAppointment = async (appointmentId: string, data: any) => {
    try {
      await api.updateAppointment(appointmentId, data);
      toast.success("Agendamento atualizado com sucesso!");
      loadAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Erro ao atualizar agendamento");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-end space-x-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("management")}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "management"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Users className="w-4 h-4" />
          Gerenciar Equipe e Serviços
        </button>
      </div>

      {activeTab === "dashboard" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:order-last">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <Dashboard appointments={appointments} />
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Novo Agendamento
              </h1>
              <AppointmentForm
                onSubmit={handleAppointmentSubmit}
                isLoading={isLoading}
              />
            </div>

            <div>
              <Tabs
                defaultValue="today"
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="today">Hoje</TabsTrigger>
                  <TabsTrigger value="all">Todos os Agendamentos</TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                  <AppointmentList
                    appointments={appointments}
                    onComplete={handleCompleteAppointment}
                    onDelete={handleDeleteAppointment}
                    onEdit={handleEditAppointment}
                  />
                </TabsContent>

                <TabsContent value="all">
                  <AppointmentList
                    appointments={appointments}
                    onComplete={handleCompleteAppointment}
                    onDelete={handleDeleteAppointment}
                    onEdit={handleEditAppointment}
                    showAll
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <ManagementForms />
      )}
    </div>
  );
}
