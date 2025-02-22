import { Building2, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';

export default function ClientCard({ client, onEdit }) {
  return (
    <div 
      onClick={() => onEdit(client)}
      className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-pink-200/20 hover:border-pink-300/30 transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header with Company Name */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-lg bg-pink-500/10 border border-pink-300/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-pink-300" />
            </div>
            <div>
              <h3 className="text-xl font-light text-white tracking-wide">{client.companyName}</h3>
              {client.location && (
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-pink-300" />
                  <span className="text-sm text-pink-200">{client.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          {client.email && (
            <a 
              href={`mailto:${client.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/10 border border-teal-300/20 hover:bg-teal-500/20 transition-colors duration-200"
            >
              <Mail className="h-4 w-4 text-teal-300" />
              <span className="text-sm text-teal-200">{client.email}</span>
            </a>
          )}
          
          {client.phone && (
            <a 
              href={`tel:${client.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-300/20 hover:bg-indigo-500/20 transition-colors duration-200"
            >
              <Phone className="h-4 w-4 text-indigo-300" />
              <span className="text-sm text-indigo-200">{client.phone}</span>
            </a>
          )}

          {client.website && (
            <a 
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-300/20 hover:bg-purple-500/20 transition-colors duration-200"
            >
              <Globe className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200">{client.website}</span>
            </a>
          )}

          {/* Contract Link */}
          {client.contractUrl && (
            <a
              href={client.contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-300/20 hover:bg-rose-500/20 transition-colors duration-200"
            >
              <FileText className="h-4 w-4 text-rose-300" />
              <span className="text-sm text-rose-200">View Contract</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 