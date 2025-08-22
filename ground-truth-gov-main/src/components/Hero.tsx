import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Camera, Clock, CheckCircle } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import heroImage from "@/assets/civic-hero.jpg";

const Hero = () => {
  const { requireAuth } = useAuthRedirect();

  const handleProtectedAction = (action: string) => {
    requireAuth(action);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-civic-blue/5">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Make Your City
                <span className="bg-gradient-to-r from-civic-blue to-civic-green bg-clip-text text-transparent">
                  {" "}Better
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Report civic issues instantly. Track their progress. Build a transparent and responsive community together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => handleProtectedAction('report-issue')}
              >
                <Camera className="w-5 h-5" />
                Report an Issue
              </Button>
              <Button 
                variant="civic-outline" 
                size="lg"
                onClick={() => handleProtectedAction('view-issues')}
              >
                <MapPin className="w-5 h-5" />
                View Public Issues
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <Card className="text-center border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-civic-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 text-civic-blue" />
                  </div>
                  <h3 className="font-semibold text-foreground">Report</h3>
                  <p className="text-sm text-muted-foreground">Photo & location</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-civic-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-civic-amber" />
                  </div>
                  <h3 className="font-semibold text-foreground">Track</h3>
                  <p className="text-sm text-muted-foreground">Real-time updates</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-civic-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-civic-green" />
                  </div>
                  <h3 className="font-semibold text-foreground">Resolved</h3>
                  <p className="text-sm text-muted-foreground">Community impact</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Citizens reporting civic issues"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-civic-blue to-civic-green rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-civic-green to-civic-blue rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;