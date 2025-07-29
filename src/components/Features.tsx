import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  AlertTriangle, 
  MapPin, 
  Users, 
  BarChart3, 
  Wifi, 
  Shield, 
  Clock,
  Camera,
  Radio
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Incident Reporting",
      description: "Comprehensive incident documentation with photos, videos, and location data for thorough investigation records.",
      color: "text-primary"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Panic Button",
      description: "One-touch emergency activation with instant location broadcast and real-time audio streaming to command centers.",
      color: "text-emergency"
    },
    {
      icon: MapPin,
      title: "Advanced Geo-Fencing",
      description: "Monitor designated mining zones and receive alerts for unauthorized activities or boundary violations.",
      color: "text-success"
    },
    {
      icon: Users,
      title: "Multi-Agency Coordination",
      description: "Seamless integration between mining marshals, police, community leaders, and government agencies.",
      color: "text-warning"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time heatmaps, incident trends, response metrics, and comprehensive reporting for strategic planning.",
      color: "text-primary"
    },
    {
      icon: Wifi,
      title: "Offline Sync Mode",
      description: "Store-and-forward capability ensures critical data is captured even in areas with poor connectivity.",
      color: "text-success"
    },
    {
      icon: Shield,
      title: "End-to-End Security",
      description: "AES-256 encryption, secure authentication, and NDPR compliance for maximum data protection.",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Live incident status updates, escalation workflows, and automated inter-agency notifications.",
      color: "text-warning"
    },
    {
      icon: Camera,
      title: "Media Evidence",
      description: "Secure photo and video capture with tamper-proof metadata for legal documentation purposes.",
      color: "text-primary"
    },
    {
      icon: Radio,
      title: "Communication Hub",
      description: "Integrated messaging system for coordinated response between all stakeholders and agencies.",
      color: "text-success"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Security Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced tools designed specifically for mining security coordination and emergency response
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-elegant transition-all duration-200 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="default" className="text-lg px-8 py-4">
            Request Demo Access
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;