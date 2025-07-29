import { Button } from "@/components/ui/button";
import { Shield, Menu, Bell, LogOut, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import guardOreLogo from "@/assets/guard-ore-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Report Incident", path: "/report", requireAuth: false },
    { name: "Dashboard", path: "/dashboard", requireAuth: true },
    { name: "Analytics", path: "/analytics", requireAuth: true },
  ];

  return (
    <header 
      className={`
        sticky top-0 z-50 transition-all duration-300 ease-in-out
        ${scrolled 
          ? 'bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-lg' 
          : 'bg-card border-b border-border'
        }
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
          >
            <img 
              src={guardOreLogo} 
              alt="GuardORE" 
              className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" 
            />
            <span className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
              GuardORE
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              if (item.requireAuth && !user) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                    hover:text-primary hover:scale-105
                    ${isActivePath(item.path) 
                      ? 'text-primary font-semibold' 
                      : 'text-foreground'
                    }
                  `}
                >
                  {item.name}
                  {/* Active indicator */}
                  {isActivePath(item.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-scale-in"></span>
                  )}
                  {/* Hover indicator */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-glow transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emergency rounded-full animate-pulse"></span>
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-muted-foreground">
                    Welcome, <span className="font-medium text-foreground">
                      {user.user_metadata?.display_name || user.email}
                    </span>
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button 
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    variant="default"
                    className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden transition-all duration-200 hover:scale-110"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <nav className="py-4 space-y-2 border-t border-border/50">
            {navItems.map((item) => {
              if (item.requireAuth && !user) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block px-4 py-3 text-sm font-medium transition-all duration-200
                    hover:bg-primary/10 hover:text-primary rounded-md
                    ${isActivePath(item.path) 
                      ? 'text-primary bg-primary/10 font-semibold' 
                      : 'text-foreground'
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {!user && (
              <div className="pt-4 space-y-2">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;