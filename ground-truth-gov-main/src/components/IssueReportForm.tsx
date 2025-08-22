import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProtectedComponent from "./ProtectedComponent";

const IssueReportForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactInfo: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to report an issue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          contact_info: formData.contactInfo || null,
          user_id: user.id,
          status: 'pending',
          priority: 'medium'
        });

      if (error) throw error;

      toast({
        title: "Issue Reported Successfully!",
        description: "Your issue has been submitted and will be reviewed by authorities.",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        contactInfo: ""
      });
      
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast({
        title: "Error Submitting Issue",
        description: "There was a problem submitting your issue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="report" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Report a Civic Issue</h2>
            <p className="text-muted-foreground">
              Help make your community better by reporting issues that need attention
            </p>
          </div>

          <ProtectedComponent
            fallbackTitle="Login Required to Report Issues"
            fallbackMessage="Please sign in to your authority account to report civic issues and track their progress."
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-civic-blue" />
                  Issue Report Form
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                        <SelectItem value="water">Water Supply</SelectItem>
                        <SelectItem value="electricity">Electricity</SelectItem>
                        <SelectItem value="garbage">Garbage Collection</SelectItem>
                        <SelectItem value="streetlights">Street Lights</SelectItem>
                        <SelectItem value="drainage">Drainage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="Enter specific location or address"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="civic-outline"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3"
                      >
                        <MapPin className="w-4 h-4" />
                        Get GPS
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the issue..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo Evidence</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-civic-blue/50 transition-colors">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">Upload photo of the issue</p>
                      <Button type="button" variant="civic-outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Information (Optional)</Label>
                    <Input
                      id="contact"
                      placeholder="Phone number or email for updates"
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll only use this to update you about your report
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    variant="civic" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? "Submitting..." : "Submit Issue Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ProtectedComponent>
        </div>
      </div>
    </section>
  );
};

export default IssueReportForm;