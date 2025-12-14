import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  ArrowRight,
  Heart,
  CreditCard
} from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const Footer: React.FC = () => {
  const { isMobile } = useMobile();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "Traditional Mithai", href: "/products?category=traditional-mithai" },
        { name: "Sugar-Free", href: "/products?category=sugar-free" },
        { name: "Gift Boxes", href: "/products?category=gift-boxes" }
      ]
    },
    {
      title: "About",
      links: [
        { name: "Our Story", href: "/#about" },
        { name: "Contact Us", href: "mailto:support@katasweets.com" },
        { name: "WhatsApp", href: "https://wa.me/1234567890" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-white border-t border-[#F3E1EA]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className={cn(
          "grid gap-8",
          isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {/* Company Info & Newsletter */}
          <div className={cn(isMobile ? "col-span-2" : "lg:col-span-2")}>
            <div>
              {/* Company Name */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1F1F1F] font-serif">Kata Sweets</h3>
                <p className="text-sm text-[#6B7280]">Sweet. Fresh. Delicious.</p>
              </div>

              <p className="text-[#6B7280] mb-6 leading-relaxed">
                Your trusted partner for premium sweets, quality desserts, and fast delivery. 
                We bring the best of homemade goodness to your doorstep with unmatched sweetness and care.
              </p>

              {/* Newsletter Signup */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-[#FF6DAA]/20">
                <h4 className="font-semibold text-[#1F1F1F] mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#FF6DAA]" />
                  Stay Updated
                </h4>
                <p className="text-sm text-[#6B7280] mb-4">
                  Get the latest offers, new arrivals, and exclusive deals delivered to your inbox.
                </p>
                
                {!isSubscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border-2 border-[#FF6DAA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6DAA]/20 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#DC143C] text-white rounded-lg hover:bg-[#B91C1C] font-medium text-sm flex items-center gap-2 shadow-lg"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-600 font-medium text-sm">✓ Successfully subscribed!</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h4 className="font-semibold text-[#1F1F1F] mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[#6B7280] hover:text-[#FF6DAA] text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* About Us Link - Below columns, beside email field */}
        <div className={cn(
          "grid gap-8 mt-0",
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {/* Spacer to align with newsletter card area */}
          <div className={cn(isMobile ? "hidden" : "lg:col-span-2")}></div>
          
          {/* About Us Link positioned below the two columns */}
          <div
            className={cn(
              isMobile ? "col-span-1 text-center" : "col-span-2 lg:col-span-2"
            )}
          >
            <p className="text-[#9CA3AF] text-sm">
              Want to know more?{' '}
              <Link
                to="/about"
                className="text-[#FF6DAA] hover:text-[#FF9FC6] font-bold text-sm"
              >
                About Us
              </Link>
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t-2 border-[#FF6DAA]/20">
          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-3"
          )}>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Phone className="w-5 h-5 text-[#FF6DAA]" />
              <div>
                <p className="font-medium text-[#1F1F1F] text-sm">Customer Support</p>
                <p className="text-[#FF6DAA] font-semibold">1800-123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Mail className="w-5 h-5 text-[#FF6DAA]" />
              <div>
                <p className="font-medium text-[#1F1F1F] text-sm">Email Support</p>
                <p className="text-[#FF6DAA] font-semibold">support@katasweets.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-[#FF6DAA]" />
              <div>
                <p className="font-medium text-[#1F1F1F] text-sm">Head Office</p>
                <p className="text-[#6B7280] text-sm">Warangal, Telangana</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t-2 border-[#FF6DAA]/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={cn(
            "flex items-center justify-between",
            isMobile ? "flex-col gap-4" : "flex-row"
          )}>
            {/* Copyright */}
            <div className="text-[#6B7280] text-sm">
              <p className="flex items-center gap-1">
                © 2024 Kata Sweets. Made with 
                <Heart className="w-4 h-4 text-accent-red fill-current" /> 
                in India. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-[#6B7280] text-sm mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#DC143C] text-white flex items-center justify-center hover:bg-[#B91C1C] shadow-lg hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#9CA3AF]" />
              <span className="text-[#6B7280] text-sm">Secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 