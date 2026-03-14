"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CheckSquare, LogOut, ListTodo, User } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We check if the user is logged in on every navigation
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const firstName = user?.name?.split(" ")[0] || "Profile";

  return (
    <nav className="border-b border-white/10 bg-darker/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
          <CheckSquare className="w-8 h-8" />
          <span>TaskManager</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>

              <Link 
                href="/tasks" 
                className={`flex items-center gap-2 hover:text-indigo-400 transition-colors ${pathname === '/tasks' ? 'text-indigo-400' : 'text-gray-400'}`}
              >
                <ListTodo className="w-4 h-4" />
                <span className="hidden md:inline">Tasks</span>
              </Link>
              <Link 
                href="/profile" 
                className={`flex items-center gap-3 hover:bg-white/5 px-2 py-1.5 rounded-xl transition-all border border-transparent hover:border-white/10 ${pathname === '/profile' ? 'bg-white/5 border-white/10' : ''}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <span className="font-medium text-gray-200">{firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors p-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="btn-primary py-1.5 px-4 text-sm">Register</Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
