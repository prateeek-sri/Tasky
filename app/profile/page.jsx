"use client";

import { useState, useEffect } from "react";
import { User, Camera, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          setName(data.user.name);
          setAvatar(data.user.avatar || "");
        }
        setLoading(false);
      });
  }, []);

  // SIMPLE EXPLANATION: How Base64 Image works
  // 1. We take the file from input.
  // 2. We use FileReader to read it as a "Data URL" (a long string of characters).
  // 3. This string is stored directly in MongoDB just like text.
  // 4. No separate image server needed!
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result); // This is the Base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    if (res.ok) alert("Profile updated!");
    setSaving(false);
  };

  if (loading) return <div className="text-center mt-20">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex flex-col items-center gap-6">
        {/* Minimal Avatar Display */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-indigo-500/30 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-gray-600" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <div className="w-full space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{user.email}</h1>
            <p className="text-gray-400 text-sm">Update your personal details below</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-indigo-500 outline-none transition-colors text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:text-indigo-400" />}
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
