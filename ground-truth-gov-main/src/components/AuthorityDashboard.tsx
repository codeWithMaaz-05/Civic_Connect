import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Search, Filter, Eye, Edit, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import IssueCard from './IssueCard';
import ProtectedComponent from './ProtectedComponent';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  image_url?: string;
  created_at: string;
  user_id: string;
  contact_info?: string;
  assigned_to?: string;
}

const AuthorityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    priority: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchAllIssues();
    }
  }, [user]);

  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues((data || []) as Issue[]);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIssue = async () => {
    if (!selectedIssue) return;

    try {
      const updates: any = {};
      if (updateForm.status) updates.status = updateForm.status;
      if (updateForm.priority) updates.priority = updateForm.priority;
      if (user?.id) updates.assigned_to = user.id;

      const { error } = await supabase
        .from('issues')
        .update(updates)
        .eq('id', selectedIssue.id);

      if (error) throw error;

      toast({
        title: "Issue Updated",
        description: "The issue has been successfully updated.",
      });

      setUpdateDialog(false);
      setSelectedIssue(null);
      setUpdateForm({ status: '', priority: '', notes: '' });
      fetchAllIssues();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the issue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusCount = (status: string) => {
    return issues.filter(issue => issue.status === status).length;
  };

  const openUpdateDialog = (issue: Issue) => {
    setSelectedIssue(issue);
    setUpdateForm({
      status: issue.status,
      priority: issue.priority,
      notes: ''
    });
    setUpdateDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-civic-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedComponent fallbackTitle="Authority Access Required" fallbackMessage="Please log in with authority credentials to access the authority dashboard.">
      <section id="authority-dashboard" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-civic-blue" />
              <h2 className="text-3xl font-bold text-foreground">
                Authority Dashboard
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage and respond to civic issues reported by citizens. Update status, assign priorities, and track resolution progress.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                    <p className="text-2xl font-bold text-foreground">{issues.length}</p>
                  </div>
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-civic-amber">{getStatusCount('pending')}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-civic-amber" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-civic-blue">{getStatusCount('in-progress')}</p>
                  </div>
                  <Clock className="w-8 h-8 text-civic-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-civic-green">{getStatusCount('resolved')}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-civic-green" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-border/50 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="public-safety">Public Safety</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Issues Grid */}
          {filteredIssues.length === 0 ? (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-12 text-center">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Issues Found
                </h3>
                <p className="text-muted-foreground">
                  {issues.length === 0 
                    ? "No issues have been reported yet."
                    : "No issues match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="relative">
                  <IssueCard 
                    issue={issue} 
                    showContactInfo={true} // Authority can see contact info
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openUpdateDialog(issue)}
                      className="gap-2 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Update Issue Dialog */}
          <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={updateForm.status} onValueChange={(value) => setUpdateForm({...updateForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={updateForm.priority} onValueChange={(value) => setUpdateForm({...updateForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Internal Notes</label>
                  <Textarea
                    placeholder="Add any internal notes about this update..."
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUpdateDialog(false)}>
                  Cancel
                </Button>
                <Button variant="civic" onClick={handleUpdateIssue}>
                  Update Issue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </ProtectedComponent>
  );
};

export default AuthorityDashboard;