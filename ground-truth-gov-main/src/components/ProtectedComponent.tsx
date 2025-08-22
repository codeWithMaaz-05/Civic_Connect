import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Users } from 'lucide-react';

interface ProtectedComponentProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

const ProtectedComponent = ({ 
  children, 
  fallbackTitle = "Authentication Required",
  fallbackMessage = "Please log in to access this feature."
}: ProtectedComponentProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-civic-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-civic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-civic-blue" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {fallbackTitle}
          </h3>
          <p className="text-muted-foreground mb-6">
            {fallbackMessage}
          </p>
          <Button 
            variant="civic" 
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="gap-2"
          >
            <Users className="w-5 h-5" />
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ProtectedComponent;