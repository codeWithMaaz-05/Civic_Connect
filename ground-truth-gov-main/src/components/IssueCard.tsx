import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Eye, Mail, Phone } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  created_at: string;
  user_id: string;
  image_url?: string;
  contact_info?: string;
  assigned_to?: string;
}

interface IssueCardProps {
  issue: Issue;
  showContactInfo?: boolean;
}

const IssueCard = ({ issue, showContactInfo = false }: IssueCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-civic-amber/10 text-civic-amber border-civic-amber/20";
      case "in-progress":
        return "bg-civic-blue/10 text-civic-blue border-civic-blue/20";
      case "resolved":
        return "bg-civic-green/10 text-civic-green border-civic-green/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-civic-red/10 text-civic-red border-civic-red/20";
      case "medium":
        return "bg-civic-amber/10 text-civic-amber border-civic-amber/20";
      case "low":
        return "bg-civic-green/10 text-civic-green border-civic-green/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "in-progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">{issue.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {issue.location}
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {issue.category}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(issue.status)}>
              {getStatusText(issue.status)}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(issue.priority)}>
              {issue.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {issue.image_url && (
          <img 
            src={issue.image_url} 
            alt={issue.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        
        <p className="text-muted-foreground text-sm line-clamp-3">
          {issue.description}
        </p>
        
        {showContactInfo && issue.contact_info && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Contact:</span>
              <span>{issue.contact_info}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            {new Date(issue.created_at).toLocaleDateString()}
          </div>
          
          <Button variant="civic-outline" size="sm">
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;