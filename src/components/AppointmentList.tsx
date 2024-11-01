import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, Pencil, Trash2 } from "lucide-react";
import type { Appointment } from "../types";
import { EditAppointmentModal } from "./EditAppointmentModal";
import toast from "react-hot-toast";

interface AppointmentListProps {
  appointments: Appointment[];
  onComplete: (appointmentId: string) => void;
  onDelete: (appointmentId: string) => void;
  onEdit: (appointmentId: string, data: any) => void;
  showAll?: boolean;
}

export function AppointmentList({
  appointments,
  onComplete,
  onDelete,
  onEdit,
  showAll = false,
}: AppointmentListProps) {
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const filteredAppointments = showAll
    ? appointments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : appointments.filter(
        (app) =>
          format(new Date(app.date), "yyyy-MM-dd") ===
          format(new Date(), "yyyy-MM-dd")
      );

  const handleDelete = async (appointmentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      onDelete(appointmentId);
    }
  };

  const getBarberName = (appointment: Appointment): string => {
    try {
      if (
        typeof appointment.barberId === "object" &&
        appointment.barberId !== null &&
        appointment.barberId.user &&
        appointment.barberId.user.name
      ) {
        return appointment.barberId.user.name;
      }
    } catch (error) {
      console.error("Error getting barber name:", error);
    }
    return "Barbeiro não disponível";
  };

  const getClientName = (appointment: Appointment): string => {
    try {
      if (
        typeof appointment.clientId === "object" &&
        appointment.clientId !== null &&
        "name" in appointment.clientId
      ) {
        return appointment.clientId.name;
      }
    } catch (error) {
      console.error("Error getting client name:", error);
    }
    return "Cliente não encontrado";
  };

  const getPhoneName = (appointment: Appointment): string => {
    try {
      const client =
        typeof appointment.clientId === "object" ? appointment.clientId : null;

      if (client && client.phone) {
        return client.phone;
      } else {
        return "cliente não cadastrou o contato";
      }
    } catch (error) {
      console.error("Error getting client phone:", error);
    }
    return "Erro ao obter telefone";
  };

  const getServiceName = (appointment: Appointment): string => {
    try {
      if (
        typeof appointment.serviceId === "object" &&
        appointment.serviceId !== null &&
        "name" in appointment.serviceId
      ) {
        return appointment.serviceId.name;
      }
    } catch (error) {
      console.error("Error getting service name:", error);
    }
    return "Serviço não encontrado";
  };

  if (filteredAppointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
        {showAll
          ? "Nenhum agendamento encontrado"
          : "Nenhum agendamento para hoje"}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg divide-y">
        {filteredAppointments.map((appointment) => (
          <div key={appointment._id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {format(new Date(appointment.date), "dd/MM/yyyy")} às{" "}
                  {appointment.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!appointment.completed && (
                  <>
                    <button
                      onClick={() => setEditingAppointment(appointment)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-gray-900 font-medium">
                Cliente: {getClientName(appointment)}
              </p>
              <p className="text-sm text-gray-500">
                Telefone: {getPhoneName(appointment)}{" "}
              </p>
              <p className="text-sm text-gray-500">
                Serviço: {getServiceName(appointment)} - R${" "}
                {appointment.revenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Barbeiro: {getBarberName(appointment)}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              {!appointment.completed ? (
                <button
                  onClick={() => onComplete(appointment._id)}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Concluir
                </button>
              ) : (
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Concluído
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={async (data) => {
            await onEdit(editingAppointment._id, data);
            setEditingAppointment(null);
          }}
        />
      )}
    </>
  );
}
