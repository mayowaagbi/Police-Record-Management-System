import { Button } from "./UI/button";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./UI/dropdown-menu";

export function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/Dashboard" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">
                CrimeTrack
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

{
  /* <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/cases">Cases</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/criminals">Criminals</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */
}
