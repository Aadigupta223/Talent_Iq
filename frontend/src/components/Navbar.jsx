import { Link, useLocation, useNavigate } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, BellIcon, CheckIcon, CheckCircle2Icon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "../hooks/useNotifications";

function Navbar() {
  const location = useLocation();

  // console.log(location); 
  const isActive = (path) => location.pathname.startsWith(path);
  const navigate = useNavigate();

  const { data: notifications } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const unreadCount = safeNotifications.filter(n => !n?.isRead).length;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };
  return (
    <nav className='bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg'>
      <div className='max-w-7xl mx-auto p-4 flex items-center justify-between'>
        {/* LOGO */}
        <Link
          to='/'
          className='group flex items-center gap-3 hover:scale-105 transition-transform duration-200'
        >
          <div className='size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg '>
            <SparklesIcon className='size-6 text-white' />
          </div>

          <div className='flex flex-col'>
            <span className='font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider'>
              Talent IQ
            </span>
            <span className='text-xs text-base-content/60 font-medium -mt-1'>Code Together</span>
          </div>
        </Link>
        {/* toggle color in switch between dashboard and problems */}
        <div className='flex items-center gap-1'>
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className='flex items-center gap-x-2.5'>
              <BookOpenIcon className='size-4' />
              <span className='font-medium hidden sm:inline'>Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className='flex items-center gap-x-2.5'>
              <LayoutDashboardIcon className='size-4' />
              <span className='font-medium hidden sm:inline'>Dashboard</span>
            </div>
          </Link>
          {/* clerk user button */}
          
          <div className="dropdown dropdown-end ml-2 mt-1">
            <label tabIndex={0} className="btn btn-ghost btn-circle indicator">
              <BellIcon className="size-5" />
              {unreadCount > 0 && (
                <span className="badge badge-sm badge-primary indicator-item">{unreadCount}</span>
              )}
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto border border-base-200">
              <li className="menu-title flex flex-row justify-between items-center py-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={() => markAllReadMutation.mutate()} className="btn btn-xs btn-ghost gap-1">
                    <CheckCircle2Icon className="size-3" /> Mark all read
                  </button>
                )}
              </li>
              {safeNotifications.length === 0 ? (
                <li className="py-4 text-center text-base-content/50">No notifications yet</li>
              ) : (
                safeNotifications.map(n => (
                  <li key={n._id}>
                    <a 
                      onClick={() => handleNotificationClick(n)}
                      className={`flex flex-col items-start gap-1 p-3 ${!n?.isRead ? 'bg-base-200/50 border-l-4 border-primary' : ''}`}
                    >
                      <span className="font-bold text-sm">{n?.title}</span>
                      <span className="text-xs text-base-content/70 whitespace-normal">{n?.message}</span>
                      <span className="text-[10px] text-base-content/50">{n?.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}</span>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className='ml-2 mt-2'>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
