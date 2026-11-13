import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { Bell, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [autoTheme, setAutoTheme] = useState(true);
  const [mapLabels, setMapLabels] = useState(true);

  const handleSave = () => {
    toast.success("System preferences updated successfully.");
  };

  const handleCancel = () => {
    setCriticalAlerts(true);
    setDailyDigest(false);
    setAutoTheme(true);
    setMapLabels(true);
    toast.info("Settings reset to defaults.");
  };

  return (
    <AppLayout title="System Settings">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="border-border shadow-panel rounded-[2rem]">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive risk alerts and system updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="risk-alerts" className="flex flex-col gap-1 cursor-pointer">
                <span className="text-sm font-bold">Critical Risk Alerts</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Get instant push notifications for critical hotspots.
                </span>
              </Label>
              <Switch
                id="risk-alerts"
                checked={criticalAlerts}
                onCheckedChange={setCriticalAlerts}
              />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-6">
              <Label htmlFor="daily-digest" className="flex flex-col gap-1 cursor-pointer">
                <span className="text-sm font-bold">Daily City Digest</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Receive a daily summary of city-wide environmental trends.
                </span>
              </Label>
              <Switch id="daily-digest" checked={dailyDigest} onCheckedChange={setDailyDigest} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-panel rounded-[2rem]">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Display Preferences</CardTitle>
            </div>
            <CardDescription>Personalise your dashboard experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col gap-1 cursor-pointer">
                <span className="text-sm font-bold">Automatic Theme</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Switch between light and dark mode based on system settings.
                </span>
              </Label>
              <Switch id="dark-mode" checked={autoTheme} onCheckedChange={setAutoTheme} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-6">
              <Label htmlFor="map-labels" className="flex flex-col gap-1 cursor-pointer">
                <span className="text-sm font-bold">Map Detail Labels</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Show zone names and risk scores directly on the map.
                </span>
              </Label>
              <Switch id="map-labels" checked={mapLabels} onCheckedChange={setMapLabels} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" className="rounded-xl" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="rounded-xl" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
