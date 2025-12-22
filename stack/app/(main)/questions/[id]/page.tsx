"use client"

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
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";

const mockQuestionData = {
  _id: "3",
  questiontitle: "How can i block user with middleware?",
  questionbody: `
## The problem

I am trying to create a complete user login form in NextJS and I want to block the user to go to other pages without a login process before. So online i found that one of the most complete solution could be the use of a middleware but i don't know how it doesn't work.

## Middleware code:

\`\`\`javascript
// middleware.ts (position: root)
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const token = req.cookies.get("authToken")?.value;
  
  if (!token) {
    console.log("[middleware] No token on", pathname, "-> redirect to /");
    return NextResponse.redirect(new URL("/", req.url));
  }
}
\`\`\`

The middleware runs but the redirects don't work properly. Sometimes users can still access protected pages even without valid tokens.
  `,
  upvote: { length: 2 },
  downvote: { length: 6 },
  noofanswer: 2,
  views: 38,
  questiontags: ["node.js", "forms", "authentication", "next.js", "middleware"],
  userposted: "Aledi5",
  userid: "u3",
  askedon: new Date().toISOString(),
  isBookmarked: false,
  answer: [
    {
      _id: "1",
      answerbody: "The issue you're experiencing is likely due to the middleware configuration...",
      useranswered: "John Doe",
      userid: "u1",
      answeredon: "2 days ago",
    },
    {
      _id: "2",
      answerbody: "Another approach you might consider is using NextAuth.js...",
      useranswered: "Felix Rodriguez",
      userid: "u2",
      answeredon: "1 day ago",
    }
  ]
};

export default function QuestionDetailPage() {
  const router = useRouter();
  const [question, setquestion] = useState<any>(mockQuestionData);
  const [newanswer, setnewAnswer] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const { user } = useAuth();

  const handleVote = (vote: string) => {
    console.log("Voting:", vote);
  };

  const handlebookmark = () => {
    setquestion((prev: any) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
  };

  const handleSubmitanswer = () => {
    if (!newanswer.trim()) return;
    setisSubmitting(true);
    setTimeout(() => {
        const newObj = {
          _id: Math.random().toString(),
          answerbody: newanswer,
          useranswered: user?.name || "Anonymous",
          userid: user?._id || "temp",
          answeredon: "Just now",
        };
        setquestion((prev: any) => ({
          ...prev,
          noofanswer: prev.noofanswer + 1,
          answer: [...(prev.answer || []), newObj],
        }));
        setnewAnswer("");
        setisSubmitting(false);
    }, 1000);
  };

  const handleDelete = () => {
    if (confirm("Are you sure?")) router.push("/");
  };

  const handleDeleteanswer = (id: string) => {
    setquestion((prev: any) => ({
      ...prev,
      answer: prev.answer.filter((a: any) => a._id !== id),
      noofanswer: prev.noofanswer - 1
    }));
  };

  return (
    <Mainlayout>
    <div className="max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900">
          {question.questiontitle}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 border-b pb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Asked {new Date(question.askedon).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Viewed</span>
            <span>{question.views} times</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Voting Section */}
        <div className="flex sm:flex-col items-center gap-2 sm:gap-1">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => handleVote("upvote")}>
            <ChevronUp className="w-8 h-8 text-gray-400 hover:text-orange-500" />
          </Button>
          <span className="text-xl font-semibold text-gray-600">
            {question.upvote.length - question.downvote.length}
          </span>
          <Button variant="ghost" size="sm" className="p-2" onClick={() => handleVote("downvote")}>
            <ChevronDown className="w-8 h-8 text-gray-400 hover:text-orange-500" />
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
                __html: question.questionbody
                  .replace(/## (.*)/g, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>')
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">$2</pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-0.5 rounded text-sm">$1</code>')
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {question.questiontags.map((tag: any) => (
              <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12">
            <div className="flex gap-4 text-gray-500 text-sm">
              <button className="hover:text-gray-800 flex items-center gap-1"><Share size={14} /> Share</button>
              <button className="hover:text-gray-800 flex items-center gap-1"><Flag size={14} /> Flag</button>
              {question.userid === user?._id && (
                <button onClick={handleDelete} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                  <Trash size={14} /> Delete
                </button>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-md min-w-[200px]">
              <div className="text-xs text-gray-500 mb-1">asked {new Date(question.askedon).toLocaleDateString()}</div>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 rounded-sm">
                  <AvatarFallback className="bg-blue-200 text-blue-800 text-xs">{question.userposted[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm text-blue-600 font-medium">{question.userposted}</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-medium mb-6">{question.noofanswer} Answers</h2>
            <div className="space-y-12">
              {question.answer.map((ans: any) => (
                <div key={ans._id} className="border-b pb-8 last:border-0">
                   <div className="prose max-w-none text-gray-800 mb-6">
                     <p>{ans.answerbody}</p>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-4 text-gray-400">
                         <button className="hover:text-gray-600">Share</button>
                         {ans.userid === user?._id && <button onClick={() => handleDeleteanswer(ans._id)} className="text-red-500 hover:text-red-700">Delete</button>}
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="text-right">
                            <div className="text-gray-500 text-xs">answered {ans.answeredon}</div>
                            <div className="text-blue-600 font-medium italic">{ans.useranswered}</div>
                         </div>
                         <Avatar className="w-8 h-8 rounded-sm">
                            <AvatarFallback className="bg-orange-100 text-orange-800 text-xs">{ans.useranswered[0]}</AvatarFallback>
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
