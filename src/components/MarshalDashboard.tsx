import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Filter,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';

type Incident = Database['public']['Tables']['incidents']['Row'];

const statusConfig = {
  pending: { color: 'bg-yellow-500', label: 'Pending', icon: Clock },
  under_review: { color: 'bg-blue-500', label: 'Under Review', icon: Eye },
  verified: { color: 'bg-green-500', label: 'Verified', icon: CheckCircle },
  dismissed: { color: 'bg-gray-500', label: 'Dismissed', icon: XCircle },
  resolved: { color: 'bg-purple-500', label: 'Resolved', icon: CheckCircle }
};

const severityConfig = {
  low: { color: 'bg-green-100 text-green-800', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
  critical: { color: 'bg-red-100 text-red-800', label: 'Critical' }
};

const IncidentCard = ({ incident, onStatusUpdate }: { 
  incident: Incident; 
  onStatusUpdate: (id: string, status: string) => void;
}) => {
  const statusInfo = statusConfig[incident.status];
  const severityInfo = severityConfig[incident.severity];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold">{incident.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={severityInfo.color}>{severityInfo.label}</Badge>
              <Badge variant="outline" className="capitalize">
                {incident.incident_type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
            <span className="text-sm font-medium">{statusInfo.label}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">{incident.description}</p>
        
        <div className="space-y-2">
          {incident.latitude && incident.longitude && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {incident.location_address || 
                 `${incident.latitude.toFixed(6)}, ${incident.longitude.toFixed(6)}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(incident.created_at), 'PPp')}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Anonymous ID: {incident.anonymous_id.slice(0, 8)}...</span>
          </div>
          
          {incident.reporter_contact && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{incident.reporter_contact}</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <Select 
              value={incident.status} 
              onValueChange={(value) => onStatusUpdate(incident.id, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const IncidentStats = ({ incidents }: { incidents: Incident[] }) => {
  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'pending').length,
    verified: incidents.filter(i => i.status === 'verified').length,
    critical: incidents.filter(i => i.severity === 'critical').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.verified}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MarshalDashboard = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [incidents, statusFilter, severityFilter]);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load incidents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = incidents;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }
    
    setFilteredIncidents(filtered);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ 
          status: newStatus as Database['public']['Enums']['incident_status'],
          verified_at: newStatus === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === id 
            ? { ...incident, status: newStatus as Database['public']['Enums']['incident_status'] }
            : incident
        )
      );

      toast({
        title: "Status Updated",
        description: `Incident status changed to ${newStatus.replace('_', ' ')}`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marshal Dashboard</h1>
          <p className="text-muted-foreground">Review and verify incident reports</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <IncidentStats incidents={incidents} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIncidents.map((incident) => (
              <IncidentCard 
                key={incident.id} 
                incident={incident} 
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIncidents
              .filter(incident => incident.status === 'pending')
              .map((incident) => (
                <IncidentCard 
                  key={incident.id} 
                  incident={incident} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIncidents
              .filter(incident => incident.severity === 'critical')
              .map((incident) => (
                <IncidentCard 
                  key={incident.id} 
                  incident={incident} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            }
          </div>
        </TabsContent>
      </Tabs>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No incidents found</h3>
          <p className="text-muted-foreground">No incidents match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default MarshalDashboard;