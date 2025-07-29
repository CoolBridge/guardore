import { Shield, Mail, Phone, MapPin } from "lucide-react";
import guardOreLogo from "@/assets/guard-ore-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={guardOreLogo} alt="GuardORE" className="w-8 h-8" />
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">GuardORE</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Empowering mining security coordination across Nigeria through advanced technology 
              and real-time incident management systems.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@guardore.gov.ng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+234-800-GUARDORE</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Federal Ministry of Solid Minerals Development, Abuja</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Incident Reporting</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Emergency Response</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">User Management</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Training Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Technical Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 GuardORE - Federal Ministry of Solid Minerals Development. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;