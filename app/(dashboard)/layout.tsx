"use client";
import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import ChatHistorySidebar from "@/components/chatHistory";
import Navbar from "@/components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
  };

  const handleSessionChange = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleNewSession = () => {
    // Reset current session when creating new one
    setCurrentSessionId(null);
  };

  console.log("Current Session ID:", currentSessionId);
  // Clone children and pass session props if it's a conversation page
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Pass session props to children (specifically ConversationPage)
      return React.cloneElement(child as React.ReactElement<any>, {
        currentSessionId,
        onSessionChange: handleSessionChange,
      });
    }
    return child;
  });

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar onOpenHistory={handleOpenHistory} />
      </div>
      <main className="md:pl-72">
        <Navbar onOpenHistory={handleOpenHistory} />
        {childrenWithProps}
      </main>

      {/* Global Chat History Sidebar */}
      <ChatHistorySidebar
        open={isHistoryOpen}
        onClose={handleCloseHistory}
        currentSessionId={currentSessionId}
        onSessionChange={handleSessionChange}
        onNewSession={handleNewSession}
      />
    </div>
  );
};

export default DashboardLayout;
