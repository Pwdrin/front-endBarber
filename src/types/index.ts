import { ReactNode } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "barber" | "client";
}

export interface Client {
  _id: string;
  name: string;
  phone?: string;
  points: number;
}

export interface Barber {
  _id: string;
  userId: string;
  specialties: string[];
  available: boolean;
  user?: User;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface Appointment {
  _id: string;
  clientId: string | Client;
  phone?: string;
  barberId: string | Barber;
  serviceId: string | Service;
  date: string;
  time: string;
  completed: boolean;
  revenue: number;
}

export interface DashboardData {
  dailyClients: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  weeklyStats: {
    date: string;
    clients: number;
  }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface BarberStats {
  monthlyAppointments: number;
  completedAppointments: number;
  revenue: number;
}
