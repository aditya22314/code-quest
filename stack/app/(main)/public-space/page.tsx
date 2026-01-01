"use client"

import React, { useState, useEffect } from "react";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, Plus, Users as UsersIcon, Image as ImageIcon, Video as VideoIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PublicSpacePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: string }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      const res = await axiosInstance.get("/social/feed");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File size should be less than 5MB");
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia([...selectedMedia, { url: reader.result as string, type }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && selectedMedia.length === 0) return;
    if (!user) {
        toast.error("Please login to post");
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/social/post", {
        content: newPostContent,
        media: selectedMedia.map(m => ({ url: m.url, mediaType: m.type }))
      });
      if (res.status === 201) {
        toast.success("Post created!");
        setNewPostContent("");
        setSelectedMedia([]);
        fetchFeed();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
        toast.error("Please login to like");
        return;
    }
    try {
      const res = await axiosInstance.patch(`/social/like/${postId}`);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (error) {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim() || !user) return;

    try {
      const res = await axiosInstance.post(`/social/comment/${postId}`, {
        commentBody: text
      });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setCommentText({ ...commentText, [postId]: "" });
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  const friendCount = user?.friends?.length || 0;
  const postLimit = friendCount <= 1 ? 1 : (friendCount > 10 ? 'Unlimited' : friendCount);

  return (
    <Mainlayout>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-orange-100 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Create a Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px] border-gray-200 focus:border-orange-500 mb-2"
              />
              
              {selectedMedia.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMedia.map((m, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border">
                      {m.type === 'image' ? (
                        <img src={m.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <VideoIcon className="text-gray-400" />
                        </div>
                      )}
                      <button 
                        onClick={() => setSelectedMedia(selectedMedia.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={(e) => handleFileSelect(e, 'image')} 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-orange-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={18} className="mr-1" /> Image
                    </Button>
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      id="video-input" 
                      onChange={(e) => handleFileSelect(e, 'video')} 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => document.getElementById('video-input')?.click()}
                    >
                      <VideoIcon size={18} className="mr-1" /> Video
                    </Button>
                 </div>
                 <Button 
                   onClick={handleCreatePost} 
                   disabled={isSubmitting || (!newPostContent.trim() && selectedMedia.length === 0)}
                   className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                 >
                   {isSubmitting ? "Posting..." : "Post"}
                 </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading feed...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">No posts yet. Be the first to share something!</div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post._id} className="border-gray-100 shadow-sm bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-gray-100">
                        <AvatarFallback className="bg-orange-50 text-orange-700">{post.userName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{post.userName}</div>
                        <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-4 text-gray-800 text-sm whitespace-pre-wrap">
                      {post.content}
                    </div>

                    {post.media?.length > 0 && (
                      <div className="px-4 pb-4 grid grid-cols-1 gap-2">
                        {post.media.map((m: any, idx: number) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-gray-100">
                             {m.mediaType === 'image' ? (
                               <img src={m.url} className="w-full object-cover max-h-[400px]" alt="Post media" />
                             ) : (
                               <video src={m.url} controls className="w-full max-h-[400px]" />
                             )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-gray-50 px-4 py-2 flex items-center justify-between text-gray-500">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center gap-1.5 hover:text-orange-500 transition-colors ${post.likes?.includes(user?._id) ? 'text-red-500' : ''}`}
                        >
                          <Heart size={18} fill={post.likes?.includes(user?._id) ? 'currentColor' : 'none'} />
                          <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                          <MessageCircle size={18} />
                          <span className="text-xs font-medium">{post.comments?.length || 0}</span>
                        </button>
                      </div>
                      <button className="hover:text-gray-900">
                        <Share2 size={18} />
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.comments?.length > 0 && (
                      <div className="bg-gray-50/50 p-4 border-t border-gray-50 space-y-3">
                        {post.comments.map((comment: any, idx: number) => (
                          <div key={idx} className="flex gap-2">
                             <div className="flex-1">
                               <span className="font-semibold text-xs text-gray-900 mr-2">{comment.userName}</span>
                               <span className="text-xs text-gray-700">{comment.commentBody}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-4 border-t border-gray-50 flex gap-2">
                      <Input 
                        placeholder="Add a comment..." 
                        value={commentText[post._id] || ""}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        className="h-8 text-xs border-gray-200"
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => handleComment(post._id)}
                      >
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-blue-100 shadow-sm bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2 text-blue-800">
                 <UsersIcon size={18} /> Social Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your Friends</div>
                  <div className="text-2xl font-bold text-gray-900">{friendCount}</div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 uppercase font-bold tracking-wider">Daily Post Limit</span>
                     <Badge variant="outline" className="border-blue-200 text-blue-700 bg-white">
                        {postLimit}
                     </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                     <div 
                        className="bg-orange-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min((user?.dailyPostCount / (typeof postLimit === 'number' ? postLimit : 999)) * 100, 100)}%` }}
                     ></div>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {typeof postLimit === 'number' 
                      ? `${user?.dailyPostCount || 0} / ${postLimit} posts used today`
                      : 'Unlimited posting unlocked!'}
                  </div>
               </div>

               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9">
                  Find More Friends
               </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm bg-white">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase">Suggested Connections</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-xs text-center py-4 text-gray-400 italic">
                   Coming soon: Suggested friends based on your tags!
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </Mainlayout>
  );
}
