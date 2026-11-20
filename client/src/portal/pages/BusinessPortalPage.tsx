import React from 'react';
import '../portal.css';
import { PortalNavbar } from '../components/portal/PortalNavbar';
import { HeroSection } from '../components/portal/HeroSection';
import { ModulesShowcase } from '../components/portal/ModulesShowcase';
import { ShortageResolverDemo } from '../components/portal/ShortageResolverDemo';
import { InteractiveStockMatrix } from '../components/portal/InteractiveStockMatrix';
import { VendorIntelligenceDemo } from '../components/portal/VendorIntelligenceDemo';
import { ExcelMigrationSection } from '../components/portal/ExcelMigrationSection';
import { SecurityArchitecture } from '../components/portal/SecurityArchitecture';
import { PricingPurchaseSection } from '../components/portal/PricingPurchaseSection';
import { TestimonialsFaq } from '../components/portal/TestimonialsFaq';
import { PortalFooter } from '../components/portal/PortalFooter';

interface BusinessPortalPageProps {
  onNavigateToLogin?: () => void;
  onNavigateToOnboarding?: () => void;
}

export const BusinessPortalPage: React.FC<BusinessPortalPageProps> = ({
  onNavigateToLogin,
  onNavigateToOnboarding,
}) => {
  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDemo = () => {
    const el = document.getElementById('resolver-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bizpilot-portal min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation */}
      <PortalNavbar
        onOpenPricing={scrollToPricing}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToOnboarding={onNavigateToOnboarding}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onOpenPricing={scrollToPricing}
          onExploreDemo={scrollToDemo}
        />

        {/* 8 Core Functional Modules Showcase */}
        <ModulesShowcase />

        {/* Headline Differentiator: Smart Shortage Resolver Simulator */}
        <ShortageResolverDemo />

        {/* Live Multi-Branch Stock Matrix Explorer */}
        <InteractiveStockMatrix />

        {/* Multi-Vendor Procurement Intelligence Demo */}
        <VendorIntelligenceDemo />



        {/* Excel / Spreadsheet Migration Wizard */}
        <ExcelMigrationSection />

        {/* Security & Multi-Tenant Architecture */}
        <SecurityArchitecture />

        {/* Pricing, Plans & Instant Purchase Modal */}
        <PricingPurchaseSection />

        {/* Customer Case Studies & FAQs */}
        <TestimonialsFaq />
      </main>

      {/* Global Footer */}
      <PortalFooter />
    </div>
  );
};
