"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import { Calendar, Search, Users } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const mockUsers = [
  {
    _id: "1",
    name: "John Doe",
    username: "johndoe",
    joinDate: "2019-03-15",
  },
  {
    _id: "2",
    name: "Felix Rodriguez",
    username: "Felix.leg",
    joinDate: "2020-07-22",
  },
  {
    _id: "3",
    name: "Alex Smith",
    username: "Aledi5",
    joinDate: "2023-11-10",
  },
  {
    _id: "4",
    name: "Sarah Johnson",
    username: "PR0X",
    joinDate: "2024-01-05",
  },
];

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";

export default function UsersPage() {
const { user: currentUser, setCurrentUser } = useAuth();
const [users, setUsers] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

const handleAddFriend = async (e: React.MouseEvent, friendId: string) => {
  e.preventDefault();
  e.stopPropagation();
  try {
    const res = await axiosInstance.post(`/social/add-friend/${friendId}`);
    if (res.status === 200) {
      toast.success("Friend added!");
      // Optionally refresh current user context to update friend count
      const updatedUser = { ...currentUser, friends: [...(currentUser.friends || []), friendId] };
      setCurrentUser(updatedUser);
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Error adding friend");
  }
};

useEffect(()=>{
  const fetchUser = async()=>{
    const res = await axiosInstance.get("/user/getallusers")
    if(res.status == 200){
      setUsers(res.data)
      setLoading(false)
    }
    else{
      console.log("Failed to fetch users")
    }
    setLoading(false)
  }
  fetchUser()
},[])

  if (loading) {
    return (
      <Mainlayout>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </Mainlayout>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Mainlayout>
        <div className="text-center text-gray-500 mt-4">No users found.</div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div className="max-w-6xl">
        <h1 className="text-xl lg:text-2xl font-semibold mb-6">Users</h1>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Filter by user" className="pl-10 h-9" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user: any) => (
            <Link key={user._id} href={`/users/${user._id}`}>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white">
                <div className="flex items-center mb-3">
                  <Avatar className="w-12 h-12 mr-3 rounded-md">
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                      {user.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-blue-600 hover:text-blue-800 truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      @{user.username || user.name.toLowerCase().replace(" ", "")}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>{user.friends?.length || 0} friends</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    <span>Joined {new Date(user.joinDate).getFullYear()}</span>
                  </div>
                  
                  {currentUser && (
                    currentUser._id === user._id ? (
                      <Badge variant="secondary" className="h-7 text-[10px] px-2 bg-gray-100 text-gray-500 border-none pointer-events-none">
                        You
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant={currentUser.friends?.includes(user._id) ? "outline" : "default"}
                        onClick={(e) => handleAddFriend(e, user._id)}
                        className={`h-7 text-[10px] px-2 ${currentUser.friends?.includes(user._id) ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-600'}`}
                        disabled={currentUser.friends?.includes(user._id)}
                      >
                        {currentUser.friends?.includes(user._id) ? "Friends" : "Add Friend"}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Mainlayout>
  );
}
