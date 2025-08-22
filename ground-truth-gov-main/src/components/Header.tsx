import { Button } from "@/components/ui/button";
import { MapPin, Users, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Header = () => {
  const { user, signOut } = useAuth();
  const { requireAuth } = useAuthRedirect();

  const handleProtectedAction = (action: string) => {
    requireAuth(action);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border/40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-civic-blue to-civic-green rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CivicConnect</h1>
              <p className="text-sm text-muted-foreground">Ground Truth Governance</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleProtectedAction('report-issue')}
              className="text-foreground hover:text-civic-blue transition-colors"
            >
              Report Issue
            </button>
            <button 
              onClick={() => handleProtectedAction('track-issues')}
              className="text-foreground hover:text-civic-blue transition-colors"
            >
              Track Issues
            </button>
            <button 
              onClick={() => handleProtectedAction('dashboard')}
              className="text-foreground hover:text-civic-blue transition-colors"
            >
              Dashboard
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {user.user_metadata?.display_name || user.email}
                </span>
                <Button variant="civic-outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant="civic-outline" 
                size="sm"
                onClick={() => window.location.href = '/auth'}
              >
                <Users className="w-4 h-4" />
                Authority Login
              </Button>
            )}
            <Button 
              variant="civic" 
              size="sm"
              onClick={() => handleProtectedAction('report-issue')}
            >
              <FileText className="w-4 h-4" />
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;