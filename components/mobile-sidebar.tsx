"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

interface MobileSidebarProps {
  onOpenHistory: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onOpenHistory }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar onOpenHistory={onOpenHistory} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
