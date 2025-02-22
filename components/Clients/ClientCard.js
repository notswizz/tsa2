import { Building2, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';

export default function ClientCard({ client, onEdit }) {
  return (
    <div 
      onClick={() => onEdit(client)}
      className="relative bg-tsa-dark/80 backdrop-blur-xl rounded-lg border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-tsa-dark to-tsa-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header with Company Name */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-lg bg-tsa-black/50 border border-tsa-accent/20 flex items-center justify-center group-hover:border-pink-300/30 transition-all duration-300">
              <Building2 className="h-7 w-7 text-tsa-accent group-hover:text-pink-300 transition-colors" />
            </div>
            <div>
              <h3 className="text-2xl font-display text-tsa-white group-hover:text-pink-50 transition-colors mb-2">{client.companyName}</h3>
              {client.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-tsa-accent group-hover:text-pink-300 transition-colors" />
                  <span className="text-sm text-tsa-light font-light">{client.location}</span>
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-tsa-black/50 border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200 group/link"
            >
              <Mail className="h-4 w-4 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
              <span className="text-sm text-tsa-white font-light">{client.email}</span>
            </a>
          )}
          
          {client.phone && (
            <a 
              href={`tel:${client.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-tsa-black/50 border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200 group/link"
            >
              <Phone className="h-4 w-4 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
              <span className="text-sm text-tsa-white font-light">{client.phone}</span>
            </a>
          )}

          {client.website && (
            <a 
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-tsa-black/50 border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200 group/link"
            >
              <Globe className="h-4 w-4 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
              <span className="text-sm text-tsa-white font-light">{client.website}</span>
            </a>
          )}

          {/* Contract Link */}
          {client.contractUrl && (
            <a
              href={client.contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-pink-500/5 border border-pink-300/10 hover:border-pink-300/20 hover:bg-pink-500/10 transition-all duration-200 group/link"
            >
              <FileText className="h-4 w-4 text-pink-300" />
              <span className="text-sm text-pink-50 font-light">View Contract</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 