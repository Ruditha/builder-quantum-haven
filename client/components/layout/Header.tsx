import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActivitySquare, BarChart3, Brain, FileUp } from "lucide-react";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "#pipeline", label: "Pipeline" },
  { to: "#impact", label: "Impact" },
];

export function Header() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            EvoWatch
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            item.to.startsWith("#") ? (
              <a key={item.to} href={item.to} className="text-sm text-muted-foreground hover:text-foreground">
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm transition-colors",
                    isActive && pathname === item.to
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
                end
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <a href="#visuals" className="gap-2">
              <BarChart3 className="h-4 w-4" /> View Trends
            </a>
          </Button>
          <Button asChild>
            <a href="#upload" className="gap-2">
              <FileUp className="h-4 w-4" /> Upload FASTA
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
