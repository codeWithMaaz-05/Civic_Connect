import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IssueReportForm from "@/components/IssueReportForm";
import PublicDashboard from "@/components/PublicDashboard";
import CitizenDashboard from "@/components/CitizenDashboard";
import AuthorityDashboard from "@/components/AuthorityDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string>('citizen');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          setUserRole(data?.role || 'citizen');
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('citizen');
        }
      }
    };

    fetchUserRole();
  }, [user]);

  const renderDashboard = () => {
    if (!user) {
      return <PublicDashboard />;
    }

    switch (userRole) {
      case 'authority':
      case 'admin':
        return <AuthorityDashboard />;
      case 'citizen':
      default:
        return <CitizenDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <IssueReportForm />
        {renderDashboard()}
      </main>
      <footer className="bg-muted/30 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 CivicConnect - Ground Truth Governance. Built for community transparency.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
