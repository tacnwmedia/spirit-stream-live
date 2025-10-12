import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Search, Calendar, Heart, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search Hymns", href: "/hymn-search", icon: Search },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Give", href: "/give", icon: Heart },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <nav className="bg-gray-900 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/a1fb4136-2ad9-49bd-af0f-1749df48c1a0.png" 
                alt="The Apostolic Church North West" 
                className="h-12 w-auto md:h-14 lg:h-16 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Admin Link */}
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent border-l border-border ml-2 pl-4"
            >
              <Settings size={20} />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-12 w-12 text-white hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-lg text-lg font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Admin Link */}
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-4 rounded-lg text-lg font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent border-t border-border mt-2 pt-4"
              >
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;