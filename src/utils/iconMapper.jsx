import { 
  Briefcase, 
  FileText, 
  CheckCircle, 
  User, 
  LayoutDashboard,
  FileEdit,
  Users,
  Calendar,
  CheckSquare,
  LogOut,
  Search,
  Bell,
  Heart
} from 'lucide-react'

// Map emoji/string icons to Lucide React icon components
export const getIconComponent = (iconString) => {
  const iconMap = {
    // Emoji mappings
    '💼': Briefcase,
    '📝': FileEdit,
    '📄': FileText,
    '✅': CheckSquare,
    'checkmark': CheckCircle,
    '👤': User,
    '📊': LayoutDashboard,
    '🔍': Search,
    '🔔': Bell,
    '👋': Users,
    '📅': Calendar,
    '🚪': LogOut,
    '✨': Heart,
    
    // String mappings
    'briefcase': Briefcase,
    'document': FileText,
    'person': User,
    'dashboard': LayoutDashboard,
    'search': Search,
    'bell': Bell,
    'users': Users,
    'calendar': Calendar,
    'logout': LogOut,
    'heart': Heart,
  }

  // Default to User icon if not found
  const IconComponent = iconMap[iconString] || User
  
  return IconComponent
}

