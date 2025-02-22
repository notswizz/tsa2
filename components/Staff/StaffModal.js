import Modal from '../common/Modal';
import StaffForm from './StaffForm';
import { Trash2 } from 'lucide-react';

export default function StaffModal({ isOpen, onClose, staff, onStaffUpdated, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      onDelete(staff._id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="relative bg-black/40 backdrop-blur-md rounded-xl border border-pink-200/20 overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-pink-200/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light tracking-wide text-white">
              {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            {staff && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-300/20 text-red-200 hover:bg-red-500/20 transition-all duration-200 group"
              >
                <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Delete</span>
              </button>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full transform -rotate-12 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full transform rotate-12 opacity-30"></div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <StaffForm
            onClose={onClose}
            onStaffUpdated={onStaffUpdated}
            initialData={staff}
            isEditing={!!staff}
            hideTitle={true}
          />
        </div>
      </div>
    </Modal>
  );
} 