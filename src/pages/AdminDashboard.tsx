import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Music, Calendar, Users, BookOpen, Heart, MessageCircle, RefreshCw, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "@/lib/adminLogger";
import AdminHymnSelector from "@/components/AdminHymnSelector";
import AdminEventManager from "@/components/AdminEventManager";
import AdminBirthdayManager from "@/components/AdminBirthdayManager";
import AdminHymnEntry from "@/components/AdminHymnEntry";
import AdminHymnCSVUpload from "@/components/AdminHymnCSVUpload";
import AdminWeddingAnniversaryManager from "@/components/AdminWeddingAnniversaryManager";
import AdminTopicManager from "@/components/AdminTopicManager";
import AdminHymnEditor from "@/components/AdminHymnEditor";

interface DailyHymns {
  opening_hymn_number: number | null;
  closing_hymn_number: number | null;
}

interface OtherHymn {
  id?: string;
  hymn_number: number | null;
  label: string;
  display_order: number;
}

interface ChurchSettings {
  setting_key: string;
  setting_value: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyHymns, setDailyHymns] = useState<DailyHymns>({
    opening_hymn_number: null,
    closing_hymn_number: null,
  });
  const [otherHymns, setOtherHymns] = useState<OtherHymn[]>([]);
  const [watchword, setWatchword] = useState("");
  const [loading, setLoading] = useState(true);
  const [showHymnEntry, setShowHymnEntry] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showHymnEditor, setShowHymnEditor] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/admin/login", { replace: true });
          return;
        }

        // Use RPC to ensure profile exists and get role
        const { data: ensured, error: ensureError } = await supabase.rpc('ensure_profile_exists');
        
        if (ensureError || !ensured || ensured.length === 0) {
          console.error('Profile verification failed:', ensureError);
          await supabase.auth.signOut();
          navigate("/admin/login", { replace: true });
          return;
        }

        const role = ensured[0]?.role;
        if (role !== 'admin') {
          console.log('Access denied - user role:', role);
          await supabase.auth.signOut();
          navigate("/admin/login", { replace: true });
          return;
        }

        // Load data from database
        await loadChurchData();
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate("/admin/login", { replace: true });
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const loadChurchData = async () => {
    try {
      // Load today's hymns
      const today = new Date().toISOString().split('T')[0];
      const { data: hymnData } = await supabase
        .from('daily_hymns')
        .select('*')
        .eq('hymn_date', today)
        .maybeSingle();

      if (hymnData) {
        setDailyHymns({
          opening_hymn_number: hymnData.opening_hymn_number,
          closing_hymn_number: hymnData.closing_hymn_number,
        });
      }

      // Load other hymns for today
      const { data: otherHymnsData } = await supabase
        .from('daily_other_hymns')
        .select('*')
        .eq('hymn_date', today)
        .order('display_order');

      if (otherHymnsData && otherHymnsData.length > 0) {
        setOtherHymns(otherHymnsData.map(h => ({
          id: h.id,
          hymn_number: h.hymn_number,
          label: h.label || 'Other Hymn',
          display_order: h.display_order,
        })));
      }

      // Load watchword
      const { data: watchwordData } = await supabase
        .from('church_settings')
        .select('setting_value')
        .eq('setting_key', 'watchword')
        .maybeSingle();

      if (watchwordData) {
        setWatchword(watchwordData.setting_value || "");
      }
    } catch (error) {
      console.error('Failed to load church data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const saveData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Save daily hymns
      const { error: hymnError } = await supabase
        .from('daily_hymns')
        .upsert({
          hymn_date: today,
          opening_hymn_number: dailyHymns.opening_hymn_number,
          closing_hymn_number: dailyHymns.closing_hymn_number,
        }, {
          onConflict: 'hymn_date'
        });

      if (hymnError) throw hymnError;

      // Log hymn changes
      if (dailyHymns.opening_hymn_number) {
        await logAdminAction(`Updated Opening Hymn to Hymn ${dailyHymns.opening_hymn_number}`);
      }
      if (dailyHymns.closing_hymn_number) {
        await logAdminAction(`Updated Closing Hymn to Hymn ${dailyHymns.closing_hymn_number}`);
      }

      // Save other hymns - delete existing and insert new
      // Note: We use a select first to check if there are rows, then delete only if rows exist
      // This avoids RLS 403 errors on empty tables
      const { data: existingOtherHymns } = await supabase
        .from('daily_other_hymns')
        .select('id')
        .eq('hymn_date', today);

      if (existingOtherHymns && existingOtherHymns.length > 0) {
        const { error: deleteError } = await supabase
          .from('daily_other_hymns')
          .delete()
          .eq('hymn_date', today);

        if (deleteError) {
          console.error('Delete other hymns error:', deleteError);
          throw deleteError;
        }
      }

      // Insert other hymns that have a hymn number selected
      const otherHymnsToSave = otherHymns
        .filter(h => h.hymn_number !== null)
        .map((h, index) => ({
          hymn_date: today,
          hymn_number: h.hymn_number!,
          label: h.label,
          display_order: index + 1,
        }));

      if (otherHymnsToSave.length > 0) {
        console.log('Saving other hymns:', otherHymnsToSave);
        const { error: otherHymnsError } = await supabase
          .from('daily_other_hymns')
          .insert(otherHymnsToSave);

        if (otherHymnsError) {
          console.error('Insert other hymns error:', otherHymnsError);
          throw otherHymnsError;
        }
        
        await logAdminAction(`Updated ${otherHymnsToSave.length} other hymn(s)`);
      }

      // Save watchword
      const { error: watchwordError } = await supabase
        .from('church_settings')
        .upsert({
          setting_key: 'watchword',
          setting_value: watchword,
        }, {
          onConflict: 'setting_key'
        });

      if (watchwordError) throw watchwordError;

      // Log watchword change
      if (watchword) {
        await logAdminAction(`Updated Watchword`);
      }

      toast({
        title: "Data Saved",
        description: "All changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving the data.",
        variant: "destructive",
      });
    }
  };

  const handleHymnCreated = (hymnNumber: number) => {
    setShowHymnEntry(false);
    toast({
      title: "Hymn Created",
      description: `Hymn #${hymnNumber} has been added to the database`,
    });
  };

  const handleHymnsUploaded = () => {
    setShowCSVUpload(false);
    toast({
      title: "Hymns Uploaded",
      description: "CSV hymns have been uploaded successfully",
    });
  };

  const handleRefreshHymnsIndex = async () => {
    try {
      const { error } = await supabase.rpc('refresh_hymns_index');
      if (error) throw error;
      await logAdminAction('Refreshed Hymns Index');
      toast({
        title: 'Hymns Refreshed',
        description: 'Hymn index reindexed successfully.',
      });
    } catch (error) {
      console.error('Refresh hymns index failed:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Unable to refresh hymns index.',
        variant: 'destructive',
      });
    }
  };

  const updateHymn = (type: 'opening' | 'closing', value: number) => {
    const field = type === 'opening' ? 'opening_hymn_number' : 'closing_hymn_number';
    setDailyHymns(prev => ({
      ...prev,
      [field]: value || null
    }));
  };

  const addOtherHymn = () => {
    const newOrder = otherHymns.length > 0 
      ? Math.max(...otherHymns.map(h => h.display_order)) + 1 
      : 1;
    setOtherHymns(prev => [...prev, {
      hymn_number: null,
      label: `Other Hymn ${newOrder}`,
      display_order: newOrder,
    }]);
  };

  const updateOtherHymn = (index: number, hymnNumber: number) => {
    setOtherHymns(prev => prev.map((h, i) => 
      i === index ? { ...h, hymn_number: hymnNumber } : h
    ));
  };

  const removeOtherHymn = (index: number) => {
    setOtherHymns(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2">
            <TabsTrigger value="hymns" className="flex flex-col items-center justify-center gap-2 py-3 px-2 h-auto">
              <Music className="w-5 h-5" />
              <span className="text-xs sm:text-sm">Hymns</span>
            </TabsTrigger>
            <TabsTrigger value="watchword" className="flex flex-col items-center justify-center gap-2 py-3 px-2 h-auto">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Watchword</span>
                <span className="sm:hidden">Word</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex flex-col items-center justify-center gap-2 py-3 px-2 h-auto">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs sm:text-sm">Topics</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex flex-col items-center justify-center gap-2 py-3 px-2 h-auto">
              <Calendar className="w-5 h-5" />
              <span className="text-xs sm:text-sm">Events</span>
            </TabsTrigger>
            <TabsTrigger value="birthdays" className="flex flex-col items-center justify-center gap-2 py-3 px-2 h-auto">
              <Users className="w-5 h-5" />
              <span className="text-xs sm:text-sm">Birthdays</span>
            </TabsTrigger>
            <TabsTrigger value="anniversaries" className="flex flex-col items-center justify-center gap-2 py-3 px-2 h-auto">
              <Heart className="w-5 h-5" />
              <span className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Anniversaries</span>
                <span className="sm:hidden">Anniv.</span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hymns">
            <div className="space-y-6">
              {/* Daily Hymn Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <AdminHymnSelector
                  value={dailyHymns.opening_hymn_number}
                  onChange={(number) => updateHymn('opening', number)}
                  label="Opening Hymn"
                  placeholder="Select opening hymn"
                />
                <AdminHymnSelector
                  value={dailyHymns.closing_hymn_number}
                  onChange={(number) => updateHymn('closing', number)}
                  label="Closing Hymn"
                  placeholder="Select closing hymn"
                />
              </div>

              {/* Other Hymns Section */}
              {otherHymns.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {otherHymns.map((hymn, index) => (
                    <div key={hymn.id || index} className="relative">
                      <AdminHymnSelector
                        value={hymn.hymn_number}
                        onChange={(number) => updateOtherHymn(index, number)}
                        label={hymn.label}
                        placeholder="Select hymn"
                      />
                      <Button
                        onClick={() => removeOtherHymn(index)}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        title="Remove this hymn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Other Hymn Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    onClick={addOtherHymn}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 border-dashed border-2 h-16"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Other Hymn</span>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Add additional hymns for today's service (e.g., offertory, special hymns)
                  </p>
                </CardContent>
              </Card>
              
              {/* Hymn Management Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Hymn Database Management</CardTitle>
                  <CardDescription>Add new hymns or upload from CSV file</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showHymnEntry && !showCSVUpload && !showHymnEditor && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={() => setShowHymnEntry(true)}
                        className="flex items-center space-x-2 w-full sm:w-auto"
                      >
                        <Music className="w-4 h-4 flex-shrink-0" />
                        <span>Add New Hymn</span>
                      </Button>
                      <Button 
                        onClick={() => setShowHymnEditor(true)}
                        variant="outline"
                        className="flex items-center space-x-2 w-full sm:w-auto"
                      >
                        <Settings className="w-4 h-4 flex-shrink-0" />
                        <span>Edit Hymn</span>
                      </Button>
                      <Button 
                        onClick={() => setShowCSVUpload(true)}
                        variant="outline"
                        className="flex items-center space-x-2 w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden xs:inline">Upload from CSV</span>
                        <span className="xs:hidden">Upload CSV</span>
                      </Button>
                      <Button 
                        onClick={handleRefreshHymnsIndex}
                        variant="secondary"
                        className="flex items-center space-x-2 w-full sm:w-auto"
                      >
                        <RefreshCw className="w-4 h-4 flex-shrink-0" />
                        <span>Refresh Hymns Data</span>
                      </Button>
                    </div>
                  )}
                  
                  {showHymnEntry && (
                    <AdminHymnEntry
                      onHymnCreated={handleHymnCreated}
                      onCancel={() => setShowHymnEntry(false)}
                    />
                  )}
                  
                  {showCSVUpload && (
                    <AdminHymnCSVUpload
                      onHymnsUploaded={handleHymnsUploaded}
                      onCancel={() => setShowCSVUpload(false)}
                    />
                  )}
                  
                  {showHymnEditor && (
                    <AdminHymnEditor
                      onCancel={() => setShowHymnEditor(false)}
                    />
                  )}
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
                  value={watchword}
                  onChange={(e) => setWatchword(e.target.value)}
                  className="min-h-[120px] text-lg"
                  placeholder="Enter the watchword..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Topic for the Day</CardTitle>
                <CardDescription>Manage daily topics and scripture references</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminTopicManager />
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
                <AdminEventManager />
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
                <AdminBirthdayManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anniversaries">
            <Card>
              <CardHeader>
                <CardTitle>Wedding Anniversaries</CardTitle>
                <CardDescription>Manage wedding anniversary list for current month</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminWeddingAnniversaryManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button - Only for Hymns and Watchword */}
        <div className="church-card">
          <Button onClick={saveData} className="church-button w-full">
            Save Hymns & Watchword
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Events, Birthdays, and Wedding Anniversaries are saved automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
