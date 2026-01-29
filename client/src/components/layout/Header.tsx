import { ChevronLeft, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  variant?: "default" | "transparent";
}

const Header = ({
  title,
  showBack = false,
  showSearch = false,
  showMenu = false,
  onMenuClick,
  isMenuOpen = false,
  variant = "default",
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header
      className={`flex items-center justify-between px-4 py-4 ${
        variant === "transparent" ? "" : "bg-background"
      }`}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-secondary" />
          </button>
        )}
        {title && (
          <h1 className="text-xl font-semibold text-secondary">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showSearch && (
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
        )}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
