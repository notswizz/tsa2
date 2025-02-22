import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2 } from 'lucide-react';
import ClientForm from './ClientForm';

export default function ClientModal({ isOpen, onClose, client, onClientUpdated }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-black/80 border border-pink-300/20 backdrop-blur-xl p-6 shadow-xl transition-all">
                {/* Header with decorative elements */}
                <div className="relative mb-6">
                  {/* Decorative gradient bars */}
                  <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-pink-500 to-transparent rounded-full" />
                  <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-l from-pink-500 to-transparent rounded-full" />
                  
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-2xl font-light tracking-wide text-white">
                      {client ? 'Edit Client' : 'Add New Client'}
                    </Dialog.Title>
                    <div className="flex items-center gap-3">
                      {client && (
                        <button
                          onClick={() => onDelete(client)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors duration-200"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <ClientForm
                  client={client}
                  onSubmit={onClientUpdated}
                  onCancel={onClose}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 