import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/authMiddleware";
import Link from "next/link";
import { CheckSquare, ArrowRight, Shield, Zap, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();
  
  if (user) {
    redirect("/tasks");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20 mb-4 animate-bounce">
          <Zap className="w-4 h-4" />
          <span>The Brutally Efficient Task Manager</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
          Secure Your Workflow <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            With Confidence
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Next-generation task management featuring AES-256 encryption, 
          JWT authentication, and a premium developer-first architecture.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
          Get Started For Free <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/login" className="glass-card px-8 py-4 text-lg hover:bg-white/10 transition-colors">
          Login to Account
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-20">
        <FeatureCard 
          icon={<Shield className="w-6 h-6" />}
          title="AES Encryption"
          description="Your sensitive task descriptions are encrypted with AES-256-CBC before hitting the database."
        />
        <FeatureCard 
          icon={<Search className="w-6 h-6" />}
          title="Advanced Search"
          description="Engineered for speed with MongoDB indexing and optimized query execution."
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6" />}
          title="Premium UI"
          description="A stunning dark-mode interface built with Tailwind CSS and Framer Motion."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card p-8 text-left space-y-4 hover:border-indigo-500/50 transition-colors group">
      <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
