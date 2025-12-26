"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Calendar, Edit, Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// const mockUserData: Record<string, any> = {
//   "1": {
//     _id: "1",
//     name: "John Doe",
//     joinDate: "2019-03-15",
//     about:
//       "Full-stack developer with 8+ years of experience in JavaScript, React, and Node.js. Passionate about clean code and helping others learn programming. I enjoy working on open-source projects and contributing to the developer community.",
//     tags: [
//       "javascript",
//       "react",
//       "node.js",
//       "typescript",
//       "python",
//       "mongodb",
//     ],
//   },
//   "2": {
//     _id: "2",
//     name: "Felix Rodriguez",
//     joinDate: "2020-07-22",
//     about: "Competitive programmer and C++ enthusiast.",
//     tags: ["c++", "templates", "algorithms"],
//   }
// };

export default function UserDetailPage() {
  const { user, setCurrentUser } = useAuth();
  const params = useParams();
  const id = params.id as string;
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    about: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/user/getuser/${id}`);
        // res.data is the user object directly from the new endpoint
        const userData = res.data;
        
        if (userData) {
          setProfileUser(userData);
          setEditForm({
            name: userData.name,
            about: userData.about || "",
            tags: userData.tags || [],
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSaveProfile = async () => {
    console.log(editForm, "editForm");
    const finalTags = [...editForm.tags];
    const pendingTag = newTag.trim();
    
    // Auto-add the pending tag if the user forgot to click the plus button
    if (pendingTag && !finalTags.includes(pendingTag)) {
      finalTags.push(pendingTag);
    }

    const payload = { ...editForm, tags: finalTags };

    try {
      console.log("Saving payload:", payload);
      const res = await axiosInstance.patch(`/user/updateprofile/${user?._id}`, payload);
      if (res.status === 200) {
        setProfileUser(res.data);
        // Sync with global auth state if it's the current user's profile
        if (user?._id === id) {
          setCurrentUser(res.data);
        }
        setNewTag(""); // Clear pending tag on success
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !editForm.tags.includes(trimmedTag)) {
      setEditForm({ ...editForm, tags: [...editForm.tags, trimmedTag] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter((tag: string) => tag !== tagToRemove),
    });
  };

  const isOwnProfile = id === user?._id;

  if (loading) {
    return (
      <Mainlayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Mainlayout>
    );
  }

  if (!profileUser) {
    return (
      <Mainlayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
          <Button variant="link" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </Mainlayout>
    );
  }
  return (
    <Mainlayout>
      <div className="max-w-6xl">
        {/* User Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">
          <Avatar className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg">
            <AvatarFallback className="text-2xl lg:text-3xl bg-blue-100 text-blue-700">
              {profileUser.name
                .split(" ")
                .map((n: any) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                  {profileUser.name}
                </h1>
              </div>

              {isOwnProfile && (
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border-none">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Your display name"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {/* About Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">About</h3>
                        <div>
                          <Label htmlFor="about" className="text-sm font-medium">About Me</Label>
                          <Textarea
                            id="about"
                            value={editForm.about}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                about: e.target.value,
                              })
                            }
                            placeholder="Tell us about yourself..."
                            className="min-h-32 mt-1"
                          />
                        </div>
                      </div>

                      {/* Tags/Skills Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Skills & Technologies</h3>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a skill"
                              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                              className="h-10"
                            />
                            <Button
                              onClick={handleAddTag}
                              className="bg-orange-500 hover:bg-orange-600 text-white shrink-0 h-10 w-10 p-0"
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {editForm.tags.map((tag: any) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border-none flex items-center gap-1.5 px-3 py-1"
                              >
                                {tag}
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="hover:text-red-600 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                          variant="ghost"
                          onClick={() => setIsEditing(false)}
                          className="hover:bg-gray-100"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Member since {profileUser.joinDate ? new Date(profileUser.joinDate).toLocaleDateString() : "Loading..."}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="font-bold text-gray-700">5</span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">gold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="font-bold text-gray-700">23</span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">silver</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded-full" />
                <span className="font-bold text-gray-700">45</span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">bronze</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-bold">About</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm lg:text-base">
                  {profileUser.about || "This user hasn't added an about section yet."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Top Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileUser.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {profileUser.tags.length === 0 && (
                    <span className="text-sm text-gray-400">No tags added yet.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
