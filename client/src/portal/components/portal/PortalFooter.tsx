import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const PortalFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">Bizpilot AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Next-generation multi-tenant inventory, procurement, and decision-support AI platform for Indian MSMEs, distributors, and manufacturers.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Indian GST & Audit Compliant</span>
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product Modules</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Executive Business Dashboard</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Product & SKU Master</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Multi-Branch Stock Matrix</a></li>
              <li><a href="#resolver-demo" className="hover:text-white transition-colors">Smart Shortage Resolver</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Multi-Vendor Procurement</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Loss Prevention & Audit</a></li>
            </ul>
          </div>

          {/* Platform & Onboarding */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing & MSME Plans</a></li>
              <li><Link to="/step-1" className="text-indigo-400 hover:text-indigo-300 font-medium">Launch 4-Step Onboarding</Link></li>
              <li><Link to="/step-2" className="hover:text-white transition-colors">2FA Authenticator Setup</Link></li>
              <li><Link to="/step-3" className="hover:text-white transition-colors">Company GST Registration</Link></li>
              <li><Link to="/step-4" className="hover:text-white transition-colors">Branch Creation Roster</Link></li>
            </ul>
          </div>

          {/* Regional Hubs & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">HQ & Support</h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Trade Tower BKC, Bandra East, Mumbai, Maharashtra 400051</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>sales@bizpilot.in / support@bizpilot.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 (022) 4890-2100 (Mon-Sat 9AM-7PM IST)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <span>&copy; {new Date().getFullYear()} Bizpilot Technologies Pvt Ltd. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security Disclosures</a>
            <a href="#" className="hover:text-slate-300">GST Compliance Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
