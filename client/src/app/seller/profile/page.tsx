"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  X,
  Loader2,
  Building2,
  Mail,
  User,
  CheckCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserData {
  id: string;
  email: string;
  name: string;
  shopName?: string;
  role: string;
  status: string;
}

export default function SellerProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");

    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        setUserData(user);
        setShopName(user.shopName || "");
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    
    setLoading(false);
  }, [router]);

  const handleShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopName(e.target.value);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!shopName.trim()) {
      toast.error("Shop name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update localStorage
      if (userData) {
        const updatedUserData: UserData = {
          ...userData,
          shopName: shopName,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      }

      setUnsavedChanges(false);
      setIsEditing(false);
      toast.success("Profile updated successfully! Redirecting to dashboard...");

      // Redirect to seller dashboard after 1.5 seconds
      setTimeout(() => {
        router.push("/seller/home");
      }, 1500);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setShopName(userData.shopName || "");
    }
    setUnsavedChanges(false);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center space-x-4 mb-8 animate-slide-down">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/seller/home")}
            className="hover:bg-primary/10 rounded-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your shop information
            </p>
          </div>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Shop Information Card */}
        <Card
          className="border-border/50 bg-gradient-to-br from-card via-card/80 to-card/50 backdrop-blur-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:scale-105 animate-slide-up"
          style={{ animationDelay: "0ms" }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>
                  Update your shop details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Shop Name Field */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <Label htmlFor="shopName" className="text-sm font-semibold">
                Shop Name
              </Label>
              {!isEditing ? (
                <div className="flex items-center justify-between p-4 bg-background/50 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300 group">
                  <span className="font-medium text-foreground">
                    {shopName || "No shop name set"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary hover:bg-primary/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="relative">
                    <Input
                      id="shopName"
                      value={shopName}
                      onChange={handleShopNameChange}
                      placeholder="Enter your shop name"
                      className="pl-4 pr-4 py-3 border-border/50 focus:border-primary/50 bg-background/50 transition-all duration-300 rounded-lg"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !unsavedChanges}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-border/50 hover:bg-background/50 transition-all duration-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card
          className="border-border/50 bg-gradient-to-br from-card via-card/80 to-card/50 backdrop-blur-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:scale-105 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "150ms" }}>
              <Label className="text-sm font-semibold text-muted-foreground">
                Full Name
              </Label>
              <div className="p-4 bg-background/50 border border-border/50 rounded-lg flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {userData.name}
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Label className="text-sm font-semibold text-muted-foreground">
                Email Address
              </Label>
              <div className="p-4 bg-background/50 border border-border/50 rounded-lg flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {userData.email}
                </span>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "250ms" }}>
              <Label className="text-sm font-semibold text-muted-foreground">
                Account Status
              </Label>
              <div className="p-4 bg-background/50 border border-border/50 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-foreground">
                  {userData.status}
                </span>
              </div>
            </div>

            {/* Account Role */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Label className="text-sm font-semibold text-muted-foreground">
                Account Role
              </Label>
              <div className="p-4 bg-background/50 border border-border/50 rounded-lg flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground capitalize">
                  {userData.role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
