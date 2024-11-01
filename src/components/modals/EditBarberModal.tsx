import React from 'react';
import { X } from 'lucide-react';
import type { Barber } from '../../types';
import { BarberForm } from '../forms/BarberForm';

interface EditBarberModalProps {
  barber: Barber;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditBarberModal({ barber, onClose, onSuccess }: EditBarberModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Editar Barbeiro</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <BarberForm 
            initialData={barber} 
            onSuccess={() => {
              onSuccess();
              onClose();
            }} 
          />
        </div>
      </div>
    </div>
  );
}