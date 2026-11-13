import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuth } from "@/auth/auth-context";
import { User, Mail, Shield, Building2, MapPin, Key, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [nameInput, setNameInput] = useState(user?.name || "");
  const [orgInput, setOrgInput] = useState(user?.org || "City Governance");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!user) return null;

  const handleSaveProfile = () => {
    updateProfile({ name: nameInput, org: orgInput });
    setIsEditProfileOpen(false);
    toast.success("Profile details updated.");
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in both current and new password.");
      return;
    }
    setIsChangePasswordOpen(false);
    setOldPassword("");
    setNewPassword("");
    toast.success("Password changed successfully.");
  };

  const toggle2FA = () => {
    const newState = !is2FAEnabled;
    setIs2FAEnabled(newState);
    if (newState) {
      toast.success("Two-Factor Authentication enabled.");
    } else {
      toast.info("Two-Factor Authentication disabled.");
    }
  };

  return (
    <AppLayout title="My Profile">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="border-border shadow-panel overflow-hidden rounded-[2.5rem]">
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-2xl border-4 border-background bg-surface flex items-center justify-center shadow-raised">
              <User className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardContent className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setNameInput(user.name);
                  setOrgInput(user.org || "City Governance");
                  setIsEditProfileOpen(true);
                }}
              >
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    Organization
                  </p>
                  <p className="text-sm font-medium">{user.org || "City Governance"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    Assigned Zone
                  </p>
                  <p className="text-sm font-medium">{user.zoneId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    Access Level
                  </p>
                  <p className="text-sm font-medium">
                    Standard {user.role === "admin" ? "Admin" : "Operator"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your password and authentication methods.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between h-12 rounded-2xl"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              <span>Change Password</span>
              <Key className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between h-12 rounded-2xl"
              onClick={toggle2FA}
            >
              <span>Two-Factor Authentication</span>
              <div
                className={`text-[10px] font-bold uppercase ${is2FAEnabled ? "text-emerald-600" : "text-risk-high"}`}
              >
                {is2FAEnabled ? "Enabled" : "Disabled"}
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update your display name and organization affiliation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase">Display Name</label>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase">Organization</label>
              <Input
                value={orgInput}
                onChange={(e) => setOrgInput(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Change Security Password</DialogTitle>
            <DialogDescription>
              Ensure your new password contains at least 8 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase">Current Password</label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
