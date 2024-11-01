import React, { useState } from "react";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { BookingModal } from "../components/BookingModal";
import { Footer } from "../components/Footer";
// import Slide from "../components/Sliders";
import CardsSlide from "../components/CardsSlide";
import Perfill from "../components/perfil/perfil.jsx";

export function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-300 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Estilo e Profissionalismo em Cada Corte
            </h1>
            <p className="text-xl mb-8">
              Experimente o melhor em serviços de barbearia com nossos
              profissionais especializados.
            </p>
            <a
              href="#agendar"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors hover:text-white"
            >
              Agende seu horário
            </a>
          </div>
        </div>
      </section>

      {/* Profesional */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 mt-10">
          Nossos Profissionais
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-20">
          <Perfill
            title="Julio"
            subtitle="Barbeiro"
            description="Tel: (21) xxx-xxx"
            avatarUrl="https://i.ibb.co/D9LcsXV/cat.png"
          />
          <Perfill
            title="Igor"
            subtitle="Barbeiro"
            description="Tel: (21) xxx-xxx"
            avatarUrl="https://i.ibb.co/gm0R0bP/gorilla.png"
          />
          <Perfill
            title="Nicholas"
            subtitle="Barbeiro"
            description="Tel: (21) xxx-xxx"
            avatarUrl="https://i.ibb.co/qM2bmw0/dog.png"
          />
          <Perfill
            title="Pedro"
            subtitle="Barbeiro"
            description="Tel: (21) xxx-xxx"
            avatarUrl="https://i.ibb.co/L5M5hZ7/chicken.png"
          />
        </div>
      </section>

      {/* <Slide /> */}

      {/* Services Section */}
      <section id="servicos" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossos Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Corte Masculino"
              price="R$ 45,00"
              description="Corte profissional personalizado de acordo com seu estilo"
            />
            <ServiceCard
              title="Barba + Cabelo"
              price="R$ 60,00"
              description="Acabamento perfeito para sua barba com produtos premium e um corte perfeito feito com carinho"
            />
            <ServiceCard
              title="Bigode"
              price="R$ 15,00"
              description="Acabamento perfeito em seu bigode com produtos premium"
            />
            <ServiceCard
              title="Sobrancelha"
              price="R$ 10,00"
              description="Acabamento perfeito em sua sobrancelha"
            />
            <ServiceCard
              title="Pigmentação"
              price="R$ 75,00"
              description="Decoração perfeita no seu cabelo com produtos premium"
            />
            <ServiceCard
              title="Corte + Pigmentação"
              price="R$ 95,00"
              description="Combinação perfeita para um visual completo"
            />
          </div>
        </div>
      </section>

      {/* CardsSlide Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Mostruário</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-20">
          <CardsSlide />
          <CardsSlide />
          <CardsSlide />
          <CardsSlide />
        </div>
      </section>

      {/* Schedule Section */}
      <section id="agendar" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Faça seu Agendamento</h2>
          <p className="text-gray-600 mb-8">
            Escolha o melhor horário para você e garanta seu atendimento
          </p>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Agendar Agora
          </button>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              icon={<Clock className="w-6 h-6" />}
              title="Horário de Funcionamento"
              description="Segunda a Sábado: 9h às 20h"
            />
            <InfoCard
              icon={<MapPin className="w-6 h-6" />}
              title="Localização"
              description="Rua Example, 123 - Centro"
            />
            <InfoCard
              icon={<Phone className="w-6 h-6" />}
              title="Contato"
              description="(21) 99999-9999"
            />
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-blue-600">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ServiceCard({
  title,
  price,
  description,
}: {
  title: string;
  price: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-blue-600 font-bold mb-4">{price}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
