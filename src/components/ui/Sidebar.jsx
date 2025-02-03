import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Building2,
  Clock,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Shield,
  Ticket
} from "lucide-react";
import { logout } from "../../store/adminSlice";
import { useDispatch } from "react-redux";
const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", to: "/companies", icon: Building2 },
  { name: "Subscriptions", to: "/subscriptions", icon: Ticket },
  { name: "Transactions", to: "/transactions", icon: BarChart2 },
  { name: "Offline Requests", to: "/offline-requests", icon: Clock },
  { name: "Email Queries", to: "/email-queries", icon: Mail },
  { name: "Super Admin", to: "/super-admin", icon: Shield },
  { name: "Website Settings", to: "/website-settings", icon: Globe },
  { name: "Settings", to: "/settings", icon: Settings },
];

export function Sidebar({ isOpen }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout());
    navigate('/')
  };
  return (
    
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#051527] text-white transition-all duration-300 ${
        isOpen ? "w-55" : "w-16"
      }`}
      style={{ height: "100vh", overflow: "hidden" , maxWidth: '16rem' }}
    >
      {isOpen && (
        <div className="p-4">
          <img
            src="https://st2.depositphotos.com/4035913/6124/i/450/depositphotos_61243833-stock-photo-letter-v-logo.jpg"
            alt="Logo"
            className="h-10 w-full object-contain"
          />
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-hidden px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`group flex items-center rounded-lg p-2 text-sm font-normal transition-colors ${
                isActive ? "bg-blue-500 text-white " : "text-gray-300 hover:text-blue-400 "
              }`}
            >
              <item.icon className="h-6 w-6 flex-shrink-0" />
              {isOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className={`group flex items-center rounded-lg p-3 text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white w-full`}
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </nav>
    </div>
  );
}
