import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { MapPin, AlertTriangle, Phone } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

const ReportIncident = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [reporterContact, setReporterContact] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const incidentTypes = [
    { value: 'theft', label: 'Theft' },
    { value: 'fraud', label: 'Fraud' },
    { value: 'safety_violation', label: 'Safety Violation' },
    { value: 'environmental_damage', label: 'Environmental Damage' },
    { value: 'equipment_tampering', label: 'Equipment Tampering' },
    { value: 'unauthorized_access', label: 'Unauthorized Access' },
    { value: 'violence', label: 'Violence' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', description: 'Minor issue, no immediate threat' },
    { value: 'medium', label: 'Medium', description: 'Moderate concern, requires attention' },
    { value: 'high', label: 'High', description: 'Serious issue, needs urgent response' },
    { value: 'critical', label: 'Critical', description: 'Emergency situation, immediate action required' }
  ];

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter location manually.",
        variant: "destructive"
      });
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get address from coordinates using reverse geocoding
          // For now, we'll just store coordinates
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
          
          toast({
            title: "Location captured",
            description: "Your current location has been recorded with the report."
          });
        } catch (error) {
          setLocation({
            latitude,
            longitude
          });
          
          toast({
            title: "Location captured",
            description: "Your current location has been recorded with the report."
          });
        }
        
        setLoadingLocation(false);
      },
      (error) => {
        let message = "Failed to get your location.";
        
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access denied. Please enable location services and try again.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out.";
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !incidentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('incidents')
        .insert({
          title,
          description,
          incident_type: incidentType as Database['public']['Enums']['incident_type'],
          severity: severity as Database['public']['Enums']['severity_level'],
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          location_address: location?.address || null,
          reporter_contact: reporterContact || null
        });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Your incident report has been submitted successfully. Thank you for helping keep the community safe."
      });

      // Reset form
      setTitle('');
      setDescription('');
      setIncidentType('');
      setSeverity('medium');
      setReporterContact('');
      setLocation(null);
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-emergency" />
            <span>Report Security Incident</span>
          </CardTitle>
          <CardDescription>
            Submit an anonymous report to help protect the mining community. All reports are treated confidentially.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Incident Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the incident"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type *</Label>
              <Select value={incidentType} onValueChange={setIncidentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about what happened, when it occurred, and any other relevant details..."
                className="min-h-24"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Location Information</Label>
              <div className="flex flex-col space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={loadingLocation}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {loadingLocation ? "Getting Location..." : "Use Current Location"}
                </Button>
                
                {location && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Location Captured:</p>
                    <p className="text-sm text-muted-foreground">
                      {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information (Optional)</Label>
              <Input
                id="contact"
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Phone number or email for follow-up (optional)"
              />
              <p className="text-xs text-muted-foreground">
                <Phone className="w-3 h-3 inline mr-1" />
                Providing contact information is optional but may help with investigation follow-up.
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitting || !title || !description || !incidentType}
              >
                {submitting ? "Submitting Report..." : "Submit Anonymous Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIncident;