"use client";

import { useState, useEffect } from "react";
import { Loader2, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
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

    if (res.ok) {
      alert("Profile updated!");
      setEditing(false);
    }

    setSaving(false);
  };

  if (loading) return <div className="text-center mt-20">Loading Profile...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">

      <style dangerouslySetInnerHTML={{ __html: `

        .card {
          width: 280px;
          height: 280px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 32px;
          padding: 3px;
          position: relative;
          box-shadow: 0px 40px 60px -40px rgba(99,102,241,0.3);
          transition: all 0.5s ease-in-out;
          font-family: sans-serif;
        }

        .card .profile-pic {
          position: absolute;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          top: 3px;
          left: 3px;
          border-radius: 29px;
          overflow: hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          transition: all 0.5s ease-in-out 0.2s;
        }

        .card .profile-pic img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .card .bottom {
          position: absolute;
          bottom: 3px;
          left: 3px;
          right: 3px;
          background: blue;
          top: 80%;
          border-radius: 29px;
          z-index: 2;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.645,0.045,0.355,1);
        }

        .card .bottom .content {
          position: absolute;
          bottom: 0;
          left: 1.5rem;
          right: 1.5rem;
          height: 160px;
        }

        .card .bottom .content .name {
          display: block;
          font-size: 1.2rem;
          color: white;
          font-weight: bold;
        }

        .card .bottom .content .about-me {
          display: block;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
          margin-top: 1rem;
        }

        .card .bottom .bottom-bottom {
          position: absolute;
          bottom: 1rem;
          left: 1.5rem;
          right: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .card .bottom .button {
          background: white;
          color: #6366f1;
          border: none;
          border-radius: 20px;
          font-size: 0.7rem;
          padding: 0.5rem 0.8rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .card .bottom .button:hover {
          background: #111827;
          color: white;
        }

        .card:hover {
          border-top-left-radius: 55px;
        }

        .card:hover .bottom {
          top: 20%;
          border-radius: 80px 29px 29px 29px;
        }

        .card:hover .profile-pic {
          width: 100px;
          height: 100px;
          top: 10px;
          left: calc(50% - 50px);
          border-radius: 50%;
          border: 4px solid #6366f1;
          z-index: 3;
        }

        .edit-input {
          margin-top:10px;
          padding:6px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.3);
          color:white;
        }

      `}} />

      <div className="card">

        <div className="profile-pic">
          {avatar ? (
            <img src={avatar} alt="avatar"/>
          ) : (
            <div className="text-4xl text-indigo-400">👤</div>
          )}

          {editing && (
            <label className="absolute bottom-2 right-2 bg-indigo-500 p-2 rounded-full cursor-pointer">
              <Camera size={14} color="white"/>
              <input hidden type="file" onChange={handleImageChange}/>
            </label>
          )}
        </div>

        <div className="bottom">

          <div className="content">

            {!editing ? (
              <>
                <span className="name">{name}</span>
                <span className="about-me">{user.email}</span>
              </>
            ) : (
              <>
                <span className="name">Edit Profile</span>
                <input
                  className="edit-input"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />
              </>
            )}

          </div>

          <div className="bottom-bottom">

            {!editing ? (
              <button className="button" onClick={()=>setEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <button className="button" onClick={handleSave}>
                {saving ? <Loader2 size={14} className="animate-spin"/> : "Save"}
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}