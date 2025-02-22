import { Dialog } from '@headlessui/react';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="cyber-box p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold text-white mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {title}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </Dialog.Title>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 