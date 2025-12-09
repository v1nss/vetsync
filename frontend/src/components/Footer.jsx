import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/vetsync.png" alt="VetSync" />
            </div>
            <div className="text-sm">
              <p className="flex items-center gap-1">
                Made with <FaHeart className="text-red-500 text-xs" /> by VetSync Team
              </p>
              <p className="text-gray-500">© {currentYear} VetSync. All rights reserved.</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition flex items-center justify-center text-gray-600"
              >
                <social.icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}