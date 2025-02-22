import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-tsa-accent/10 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/tsalogo.png"
              alt="The Smith Agency Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="font-display text-tsa-white">
                The Smith Agency
              </span>
              <span className="text-sm text-tsa-light">
                © {new Date().getFullYear()} All rights reserved
              </span>
            </div>
          </div>
          <div className="text-sm text-tsa-light font-light">
            Connecting Ambition with Opportunity
          </div>
        </div>
      </div>
    </footer>
  );
} 