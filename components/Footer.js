import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-tsa-pink/20 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/tsalogo.png"
              alt="The Smith Agency Logo"
              width={32}
              height={32}
              className="rounded-full object-cover object-center scale-150"
            />
            <span className="text-gray-400 text-sm">
              © {new Date().getFullYear()} The Smith Agency
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            Connecting Ambition with Opportunity
          </div>
        </div>
      </div>
    </footer>
  );
} 