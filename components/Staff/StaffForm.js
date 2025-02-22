import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function StaffForm({ onClose, onStaffUpdated, initialData, isEditing, hideTitle = false }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: [],
    birthday: '',
    college: '',
    shoeSize: '',
    dressSize: '',
    photoUrl: '',
    resumeUrl: '',
    status: 'active',
    daysWorked: 0,
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const locations = ['ATL', 'NYC', 'LA', 'DAL'];
  const shoeSizes = Array.from({ length: 17 }, (_, i) => (i + 5).toString()); // 5 to 21
  const dressSizes = Array.from({ length: 17 }, (_, i) => i.toString()); // 0 to 16

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: Array.isArray(initialData.location) ? initialData.location : [initialData.location] || [],
        birthday: initialData.birthday ? new Date(initialData.birthday).toISOString().split('T')[0] : '',
        college: initialData.college || '',
        shoeSize: initialData.shoeSize || '',
        dressSize: initialData.dressSize || '',
        photoUrl: initialData.photoUrl || '',
        resumeUrl: initialData.resumeUrl || '',
        status: initialData.status || 'active',
        daysWorked: initialData.daysWorked || 0,
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/staff/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload photo');
      
      const data = await res.json();
      setFormData(prev => ({ ...prev, photoUrl: data.url }));
    } catch (err) {
      setError('Error uploading photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = async () => {
    if (formData.photoUrl) {
      try {
        // Delete the photo from S3 if it exists
        const res = await fetch('/api/staff/delete-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photoUrl: formData.photoUrl }),
        });

        if (!res.ok) {
          throw new Error('Failed to delete photo');
        }
      } catch (err) {
        console.error('Error deleting photo:', err);
      }
    }
    
    // Update form data regardless of S3 deletion success
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const handleLocationChange = (loc) => {
    setFormData(prev => {
      const newLocations = prev.location.includes(loc)
        ? prev.location.filter(l => l !== loc)
        : [...prev.location, loc];
      return { ...prev, location: newLocations };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/staff/${initialData._id}` : '/api/staff';
      const method = isEditing ? 'PUT' : 'POST';

      // If we're editing and the photo has changed, delete the old photo
      if (isEditing && initialData.photoUrl && initialData.photoUrl !== formData.photoUrl) {
        await fetch('/api/staff/delete-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photoUrl: initialData.photoUrl }),
        });
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || (isEditing ? 'Failed to update staff member' : 'Failed to create staff member'));
      }
      
      const updatedStaff = await res.json();
      onStaffUpdated(updatedStaff);
      onClose();
    } catch (err) {
      setError(err.message || (isEditing ? 'Failed to update staff member' : 'Failed to create staff member'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cyber-box p-6 rounded-lg">
      {!hideTitle && (
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h2>
      )}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="flex items-center gap-4">
          {formData.photoUrl ? (
            <div className="relative">
              <Image
                src={formData.photoUrl}
                alt="Staff photo"
                width={100}
                height={100}
                className="rounded-full object-cover ring-2 ring-pink-300/20"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 p-1 bg-red-500/10 border border-red-300/20 rounded-full hover:bg-red-500/20 transition-all duration-200 group"
              >
                <X className="h-4 w-4 text-red-300 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-[100px] h-[100px] rounded-full bg-pink-500/10 border-2 border-dashed border-pink-300/20 flex items-center justify-center cursor-pointer hover:bg-pink-500/15 transition-all duration-200 group"
            >
              <Upload className="h-6 w-6 text-pink-300 group-hover:scale-110 transition-transform" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Staff Photo</h3>
            <p className="text-sm text-gray-400">Upload a professional photo</p>
            {uploadingPhoto && <p className="text-sm text-cyan-300 mt-1">Uploading...</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Name</label>
            <input
              type="text"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Email</label>
            <input
              type="email"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Phone</label>
            <input
              type="tel"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Birthday</label>
            <input
              type="date"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">College</label>
            <input
              type="text"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="Enter college name"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Days Worked</label>
            <input
              type="number"
              min="0"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.daysWorked}
              onChange={(e) => setFormData({ ...formData, daysWorked: parseInt(e.target.value) || 0 })}
              placeholder="Enter number of days"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Shoe Size</label>
            <select
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.shoeSize}
              onChange={(e) => setFormData({ ...formData, shoeSize: e.target.value })}
              required
            >
              <option value="">Select Size</option>
              {shoeSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Dress Size</label>
            <select
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.dressSize}
              onChange={(e) => setFormData({ ...formData, dressSize: e.target.value })}
              required
            >
              <option value="">Select Size</option>
              {dressSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Resume URL</label>
            <input
              type="url"
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="Enter resume URL"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Status</label>
            <select
              className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white focus:border-pink-300/40 focus:outline-none transition-colors"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Locations Section */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">Locations</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {locations.map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocationChange(loc)}
                className={`p-2.5 rounded-lg border transition-all duration-200 ${
                  formData.location.includes(loc)
                    ? 'bg-pink-500/20 border-pink-300/40 text-white'
                    : 'border-pink-300/20 text-gray-300 hover:bg-pink-500/10'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{loc}</span>
                </div>
              </button>
            ))}
          </div>
          {formData.location.length === 0 && (
            <p className="text-red-400 text-sm mt-1.5">Please select at least one location</p>
          )}
        </div>

        {/* Notes Section */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">Notes</label>
          <textarea
            className="w-full bg-black/20 border border-pink-300/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:border-pink-300/40 focus:outline-none transition-colors"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-pink-300/20 text-pink-200 rounded-lg hover:bg-pink-500/10 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-pink-500/20 border border-pink-300/30 text-pink-100 rounded-lg hover:bg-pink-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Staff' : 'Add Staff')}
          </button>
        </div>
      </form>
    </div>
  );
} 