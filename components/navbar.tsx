// import { UserButton } from "@clerk/nextjs";
// import MobileSidebar from "./mobile-sidebar";

// interface NavbarProps {
//   onOpenHistory: () => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ onOpenHistory }) => {
//   return (
//     <div className="flex items-center p-4">
//       <MobileSidebar onOpenHistory={onOpenHistory} />
//       <div className="flex w-full justify-end">
//         <UserButton afterSignOutUrl="/" />
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import { UserButton } from "@clerk/nextjs";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";

interface NavbarProps {
  onOpenHistory: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenHistory }) => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar onOpenHistory={onOpenHistory} />

      {/* Optional: Add chat history button directly in navbar for larger screens */}
      {/* <div className="hidden md:flex ml-4">
        <Button
          onClick={onOpenHistory}
          className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white"
        >
          <History className="w-4 h-4" />
          Chat History
        </Button>
      </div> */}

      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
