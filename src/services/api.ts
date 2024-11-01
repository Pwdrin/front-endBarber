import type {
  User,
  Client,
  Barber,
  Service,
  Appointment,
  AuthResponse,
  DashboardData,
  BarberStats,
} from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro na requisição");
  }

  return data;
}

export const api = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    return handleResponse<AuthResponse>(response);
  },

  async getBarbers(): Promise<Barber[]> {
    const response = await fetch(`${API_URL}/barbers`, {
      credentials: "include",
    });
    return handleResponse<Barber[]>(response);
  },

  async createBarber(data: {
    name: string;
    email: string;
    password: string;
    specialties?: string[];
  }): Promise<Barber> {
    const response = await fetch(`${API_URL}/barbers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Barber>(response);
  },

  async updateBarber(
    id: string,
    data: {
      name: string;
      email: string;
      password?: string;
      specialties?: string[];
    }
  ): Promise<Barber> {
    const response = await fetch(`${API_URL}/barbers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Barber>(response);
  },

  async deleteBarber(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/barbers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await handleResponse<void>(response);
  },

  async getServices(): Promise<Service[]> {
    const response = await fetch(`${API_URL}/services`, {
      credentials: "include",
    });
    return handleResponse<Service[]>(response);
  },

  async createService(data: {
    name: string;
    price: number;
    duration: number;
    description?: string;
  }): Promise<Service> {
    const response = await fetch(`${API_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Service>(response);
  },

  async updateService(
    id: string,
    data: {
      name: string;
      price: number;
      duration: number;
      description?: string;
    }
  ): Promise<Service> {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Service>(response);
  },

  async deleteService(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await handleResponse<void>(response);
  },

  async createClient(data: { name: string; phone?: string }): Promise<Client> {
    const response = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Client>(response);
  },

  async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_URL}/appointments`, {
      credentials: "include",
    });
    return handleResponse<Appointment[]>(response);
  },

  async createAppointment(data: {
    clientId: string;
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
    revenue: number;
  }): Promise<Appointment> {
    const response = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Appointment>(response);
  },

  async updateAppointment(
    id: string,
    data: {
      clientId: string;
      barberId: string;
      serviceId: string;
      date: string;
      time: string;
      revenue: number;
    }
  ): Promise<Appointment> {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<Appointment>(response);
  },

  async deleteAppointment(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await handleResponse<void>(response);
  },

  async completeAppointment(id: string): Promise<Appointment> {
    const response = await fetch(`${API_URL}/appointments/${id}/complete`, {
      method: "PATCH",
      credentials: "include",
    });
    return handleResponse<Appointment>(response);
  },

  async checkAvailability(data: {
    barberId: string;
    date: string;
    time: string;
    excludeAppointmentId?: string;
  }): Promise<{ available: boolean }> {
    const response = await fetch(`${API_URL}/appointments/check-availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse<{ available: boolean }>(response);
  },

  async getBarberStats(): Promise<Record<string, BarberStats>> {
    const response = await fetch(`${API_URL}/barbers/stats`, {
      credentials: "include",
    });
    return handleResponse<Record<string, BarberStats>>(response);
  },
};
