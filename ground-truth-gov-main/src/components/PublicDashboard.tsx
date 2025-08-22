import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import IssueCard from "./IssueCard";
import ProtectedComponent from "./ProtectedComponent";

const PublicDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRole();
    fetchIssues();
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data and filter contact_info based on user authorization
      const transformedIssues = data?.map(issue => {
        // Determine if user can see contact info
        const canSeeContactInfo = user && (
          issue.user_id === user.id || // User owns the issue
          userRole === 'authority' || // User is authority
          userRole === 'admin' // User is admin
        );

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          location: issue.location,
          category: issue.category,
          status: issue.status,
          reportedAt: new Date(issue.created_at).toISOString().split('T')[0],
          imageUrl: issue.image_url,
          userId: issue.user_id,
          // Only include contact_info if user is authorized to see it
          contactInfo: canSeeContactInfo ? issue.contact_info : null,
          priority: issue.priority,
          assignedTo: issue.assigned_to,
        };
      }) || [];

      setIssues(transformedIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusCount = (status: string) => {
    return issues.filter(issue => issue.status === status).length;
  };

  if (loading) {
    return (
      <section id="dashboard" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-civic-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading issues...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Public Issues Dashboard</h2>
          <p className="text-muted-foreground">
            Transparent tracking of all civic issues reported in our community
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center border-civic-amber/20 bg-civic-amber/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-civic-amber" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{getStatusCount("pending")}</h3>
              <p className="text-sm text-muted-foreground">Pending Issues</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-civic-blue/20 bg-civic-blue/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-civic-blue" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{getStatusCount("in-progress")}</h3>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-civic-green/20 bg-civic-green/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-civic-green" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{getStatusCount("resolved")}</h3>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </div>

        <ProtectedComponent
          fallbackTitle="Login Required to View Dashboard"
          fallbackMessage="Please sign in to access the issues dashboard and track civic issues in your community."
        >
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issues or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                    <SelectItem value="water">Water Supply</SelectItem>
                    <SelectItem value="streetlights">Street Lights</SelectItem>
                    <SelectItem value="garbage">Garbage Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Issues Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No issues found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </ProtectedComponent>
      </div>
    </section>
  );
};

export default PublicDashboard;