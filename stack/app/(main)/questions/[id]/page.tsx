"use client"

import React, { useState, useEffect } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  History,
  Share,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";

export default function QuestionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [question, setquestion] = useState<any>(null);
  const [loading, setloading] = useState(true);
  const [newanswer, setnewAnswer] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setloading(true);
        const res = await axiosInstance.get("/question/getallquestions");
        const matched = res.data.find((q: any) => q._id === id);
        if (matched) {
          setquestion(matched);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching question");
      } finally {
        setloading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleVote = async (vote: string) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }
    try {
      const res = await axiosInstance.patch(`/question/vote/${id}`, { value: vote });
      if (res.status === 200) {
        setquestion(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error voting");
    }
  };

  const handlebookmark = () => {
    setquestion((prev: any) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
  };

  const handleSubmitanswer = async () => {
    if (!newanswer.trim() || !user) {
      toast.error("Please login to answer");
      return;
    }
    setisSubmitting(true);
    try {
      const res = await axiosInstance.post(`/answer/postanswer/${id}`, {
        noOfAnswers: (question.answer?.length || 0) + 1,
        answerBody: newanswer,
        userAnswered: user.name,
        userId: user._id
      });
      if (res.status === 200) {
        toast.success("Answer posted successfully");
        setnewAnswer("");
        setquestion(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error posting answer");
    } finally {
      setisSubmitting(false);
    }
  };

  const handleDeleteanswer = async (answerId: string) => {
    if (confirm("Are you sure you want to delete this answer?")) {
      try {
        const res = await axiosInstance.delete(`/answer/delete/${id}`, {
          data: {
            noOfAnswers: (question.answer?.length || 0) - 1,
            answerId: answerId
          }
        });
        if (res.status === 200) {
          toast.success("Answer deleted");
          setquestion(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error deleting answer");
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        const res = await axiosInstance.delete(`/question/delete/${id}`);
        if (res.status === 200) {
          toast.success("Question deleted");
          router.push("/");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error deleting question");
      }
    }
  };

  if (loading) {
    return (
      <Mainlayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </Mainlayout>
    );
  }

  if (!question) {
    return (
      <Mainlayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">Question not found</h2>
          <Button variant="link" className="mt-4" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
    <div className="max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900">
          {question.questionTitle}
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 border-b pb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Asked {question.askedOn ? new Date(question.askedOn).toLocaleDateString() : 'recently'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Viewed</span>
            <span>{question.views || 0} times</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Voting Section */}
        <div className="flex sm:flex-col items-center gap-2 sm:gap-1">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => handleVote("upvote")}>
            <ChevronUp 
              className={`w-8 h-8 ${question.upvotes?.includes(user?._id) ? "text-orange-600" : "text-gray-400"} hover:text-orange-500`} 
            />
          </Button>
          <span className="text-xl font-semibold text-gray-600">
            {(question.upvotes?.length || 0) - (question.downvotes?.length || 0)}
          </span>
          <Button variant="ghost" size="sm" className="p-2" onClick={() => handleVote("downvote")}>
            <ChevronDown 
              className={`w-8 h-8 ${question.downvotes?.includes(user?._id) ? "text-orange-600" : "text-gray-400"} hover:text-orange-500`} 
            />
          </Button>
          
          <div className="flex sm:flex-col gap-4 mt-2 sm:mt-4">
            <Button
              variant="ghost"
              size="sm"
              className={question.isBookmarked ? "text-yellow-500" : "text-gray-300"}
              onClick={handlebookmark}
            >
              <Bookmark className="w-6 h-6" fill={question.isBookmarked ? "currentColor" : "none"} />
            </Button>
            <History className="w-6 h-6 text-gray-300 cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="prose max-w-none text-gray-800 leading-relaxed mb-8">
            <div
              dangerouslySetInnerHTML={{
                __html: (question.questionBody || "")
                  .replace(/## (.*)/g, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>')
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">$2</pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-0.5 rounded text-sm">$1</code>')
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {question.questionTags?.map((tag: any) => (
              <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12">
            <div className="flex gap-4 text-gray-500 text-sm">
              <button className="hover:text-gray-800 flex items-center gap-1"><Share size={14} /> Share</button>
              <button className="hover:text-gray-800 flex items-center gap-1"><Flag size={14} /> Flag</button>
              {question.userId === user?._id && (
                <button onClick={handleDelete} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                  <Trash size={14} /> Delete
                </button>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-md min-w-[200px]">
              <div className="text-xs text-gray-500 mb-1">asked {question.askedOn ? new Date(question.askedOn).toLocaleDateString() : 'recently'}</div>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 rounded-sm">
                  <AvatarFallback className="bg-blue-200 text-blue-800 text-xs">{question.userPosted?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm text-blue-600 font-medium">{question.userPosted}</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-medium mb-6">{question.noOfAnswers || 0} Answers</h2>
            <div className="space-y-12">
              {question.answer?.map((ans: any) => (
                <div key={ans._id} className="border-b pb-8 last:border-0">
                   <div className="prose max-w-none text-gray-800 mb-6">
                     <p>{ans.answerBody}</p>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-4 text-gray-400">
                         <button className="hover:text-gray-600">Share</button>
                         {ans.userId === user?._id && (
                           <button onClick={() => handleDeleteanswer(ans._id)} className="text-red-500 hover:text-red-700">
                             Delete
                           </button>
                         )}
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="text-right">
                            <div className="text-gray-500 text-xs">answered {ans.askedOn ? new Date(ans.askedOn).toLocaleDateString() : 'recently'}</div>
                            <div className="text-blue-600 font-medium italic">{ans.userAnswered}</div>
                         </div>
                         <Avatar className="w-8 h-8 rounded-sm">
                            <AvatarFallback className="bg-orange-100 text-orange-800 text-xs">{ans.userAnswered?.[0] || 'U'}</AvatarFallback>
                         </Avatar>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-medium mb-4">Your Answer</h3>
            <Textarea
              className="min-h-[200px] mb-4 border-gray-300 focus:border-blue-500"
              placeholder="Write your answer..."
              value={newanswer}
              onChange={(e) => setnewAnswer(e.target.value)}
            />
            <Button 
                onClick={handleSubmitanswer} 
                disabled={!newanswer.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSubmitting ? "Posting..." : "Post Your Answer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
    </Mainlayout>
  );
}
