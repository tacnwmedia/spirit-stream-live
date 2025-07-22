import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Music, Calendar, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface ChurchData {
  openingHymn: { number: number; title: string };
  closingHymn: { number: number; title: string };
  watchword: string;
  events: { date: string; title: string; description: string }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [churchData, setChurchData] = useState<ChurchData>({
    openingHymn: { number: 25, title: "Amazing Grace" },
    closingHymn: { number: 134, title: "Be Thou My Vision" },
    watchword: "The Lord is my shepherd; I shall not want. - Psalm 23:1",
    events: [
      { date: "2024-07-28", title: "Sunday Service", description: "Regular worship service" },
      { date: "2024-07-31", title: "Bible Study", description: "Wednesday evening Bible study" }
    ]
  });

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem("churchAdmin")) {
      navigate("/admin/login");
    }
    
    // Load saved data
    const saved = localStorage.getItem("churchData");
    if (saved) {
      setChurchData(JSON.parse(saved));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("churchAdmin");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const saveData = () => {
    localStorage.setItem("churchData", JSON.stringify(churchData));
    toast({
      title: "Data Saved",
      description: "All changes have been saved successfully.",
    });
  };

  const updateHymn = (type: 'opening' | 'closing', field: 'number' | 'title', value: string | number) => {
    const hymnKey = type === 'opening' ? 'openingHymn' : 'closingHymn';
    setChurchData(prev => ({
      ...prev,
      [hymnKey]: {
        ...prev[hymnKey],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="church-card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Manage church content and information
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="hymns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hymns" className="flex items-center space-x-2">
              <Music className="w-4 h-4" />
              <span>Hymns</span>
            </TabsTrigger>
            <TabsTrigger value="watchword" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Watchword</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="birthdays" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Birthdays</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hymns">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Opening Hymn */}
              <Card>
                <CardHeader>
                  <CardTitle>Opening Hymn</CardTitle>
                  <CardDescription>Set the hymn for service opening</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="opening-number">Hymn Number</Label>
                    <Input
                      id="opening-number"
                      type="number"
                      value={churchData.openingHymn.number}
                      onChange={(e) => updateHymn('opening', 'number', parseInt(e.target.value))}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="opening-title">Hymn Title</Label>
                    <Input
                      id="opening-title"
                      value={churchData.openingHymn.title}
                      onChange={(e) => updateHymn('opening', 'title', e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Closing Hymn */}
              <Card>
                <CardHeader>
                  <CardTitle>Closing Hymn</CardTitle>
                  <CardDescription>Set the hymn for service closing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="closing-number">Hymn Number</Label>
                    <Input
                      id="closing-number"
                      type="number"
                      value={churchData.closingHymn.number}
                      onChange={(e) => updateHymn('closing', 'number', parseInt(e.target.value))}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="closing-title">Hymn Title</Label>
                    <Input
                      id="closing-title"
                      value={churchData.closingHymn.title}
                      onChange={(e) => updateHymn('closing', 'title', e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="watchword">
            <Card>
              <CardHeader>
                <CardTitle>Church Watchword</CardTitle>
                <CardDescription>Set the scripture or phrase recited after services</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={churchData.watchword}
                  onChange={(e) => setChurchData(prev => ({ ...prev, watchword: e.target.value }))}
                  className="min-h-[120px] text-lg"
                  placeholder="Enter the watchword..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage church events and calendar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Event management coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="birthdays">
            <Card>
              <CardHeader>
                <CardTitle>Member Birthdays</CardTitle>
                <CardDescription>Manage birthday list for current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Birthday management coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="church-card">
          <Button onClick={saveData} className="church-button w-full">
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;