import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="absolute inset-0 bg-black/50"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        style={{ backgroundImage: `url(${heroBanner})` }}
      ></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            GuardORE
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-primary-glow">
              Mining-Marshall & Security Coordination
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Secure, real-time incident reporting and emergency coordination for mining marshals, 
            law enforcement, and community leaders across Nigeria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/report">
              <Button size="lg" variant="emergency" className="text-lg px-8 py-4">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Report Incident
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="hero" className="text-lg px-8 py-4">
                <Shield className="w-5 h-5 mr-2" />
                Access Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-primary-foreground/80">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-primary-glow mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Reporting</h3>
              <p className="text-center">End-to-end encrypted incident reporting with real-time location tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-primary-glow mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multi-Agency Coordination</h3>
              <p className="text-center">Seamless collaboration between marshals, police, and community leaders</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-primary-glow mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geo-Fencing</h3>
              <p className="text-center">Advanced location monitoring and illegal mining activity detection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;