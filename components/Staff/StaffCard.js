import { Calendar, MapPin, GraduationCap, Footprints, Shirt, Clock10, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { calculateAge } from '@/utils/dateUtils';

const locationNames = {
  'ATL': 'Atlanta',
  'NYC': 'New York',
  'LA': 'Los Angeles',
  'DAL': 'Dallas'
};

export default function StaffCard({ member, onClick }) {
  return (
    <div 
      onClick={() => onClick(member)}
      className="relative bg-tsa-dark/80 backdrop-blur-xl rounded-lg border border-tsa-accent/10 hover:border-tsa-accent/20 transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-elegant opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Main Content */}
      <div className="relative p-3 md:p-4">
        {/* Profile Photo Section */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-elegant group-hover:shadow-hover transition-all duration-300">
          {member.photoUrl ? (
            <div className="relative w-full h-full group-hover:scale-[1.02] transition-transform duration-500">
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Elegant gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-tsa-black/90 via-tsa-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-tsa-black/40 to-transparent"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-tsa-black/50 flex items-center justify-center rounded-lg">
              <span className="text-5xl text-tsa-accent/50 font-display">
                {member.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlaid Stats */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Age Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tsa-black/80 backdrop-blur-sm border border-tsa-accent/20">
              <Calendar className="h-3.5 w-3.5 text-tsa-accent" />
              <span className="text-xs font-light text-tsa-white">{calculateAge(member.birthday)} yrs</span>
            </div>
            {/* Sizes Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-tsa-black/80 backdrop-blur-sm border border-tsa-accent/20">
              <div className="flex items-center gap-1">
                <Footprints className="h-3.5 w-3.5 text-tsa-accent" />
                <span className="text-xs font-light text-tsa-white">{member.shoeSize}</span>
              </div>
              <div className="w-px h-2.5 bg-tsa-accent/20"></div>
              <div className="flex items-center gap-1">
                <Shirt className="h-3.5 w-3.5 text-tsa-accent" />
                <span className="text-xs font-light text-tsa-white">{member.dressSize}</span>
              </div>
            </div>
            {/* Days Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tsa-black/80 backdrop-blur-sm border border-tsa-accent/20">
              <Clock10 className="h-3.5 w-3.5 text-tsa-accent" />
              <span className="text-xs font-light text-tsa-white">{member.daysWorked}d</span>
            </div>
          </div>

          {/* Name and Location */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-tsa-black/95 via-tsa-black/80 to-transparent backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-display text-tsa-white mb-3 line-clamp-2">{member.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              {member.location.map((loc, index) => (
                <div 
                  key={loc}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-tsa-black/80 backdrop-blur-sm border border-tsa-accent/20"
                >
                  {index === 0 && <MapPin className="h-3 w-3 text-tsa-accent" />}
                  <span className="text-xs font-light text-tsa-white">{locationNames[loc]}</span>
                </div>
              ))}
            </div>

            {/* Notes Overlay - Appears on Hover */}
            {member.notes && (
              <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4 bg-gradient-to-t from-tsa-black/95 via-tsa-black/90 to-transparent backdrop-blur-sm">
                <p className="text-sm text-tsa-light font-light line-clamp-3">
                  {member.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            {member.college && (
              <div className="flex-1 flex items-center gap-2 text-tsa-light px-1">
                <div className="p-1 rounded-md bg-tsa-white/5">
                  <GraduationCap className="h-4 w-4 text-tsa-accent" />
                </div>
                <span className="text-sm font-light truncate">{member.college}</span>
              </div>
            )}
            
            {/* Contact Icons */}
            <a 
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-md bg-tsa-black/50 border border-tsa-accent/10 hover:border-tsa-accent/20 transition-all duration-200 group/link"
              title={member.email}
            >
              <Mail className="h-4 w-4 text-tsa-accent group-hover/link:scale-110 transition-transform" />
            </a>
            <a 
              href={`tel:${member.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-md bg-tsa-black/50 border border-tsa-accent/10 hover:border-tsa-accent/20 transition-all duration-200 group/link"
              title={member.phone}
            >
              <Phone className="h-4 w-4 text-tsa-accent group-hover/link:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 