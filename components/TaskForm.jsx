"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("pending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description, status }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setStatus("pending");
      onTaskCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h2 className="text-xl font-bold">Add New Task</h2>
      <input
        placeholder="Task Title"
        className="input-field w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="input-field w-full h-24"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        className="input-field w-full bg-slate-900 border-white/10 text-white cursor-pointer"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending" className="bg-slate-900 text-white">Pending</option>
        <option value="in-progress" className="bg-slate-900 text-white">In Progress</option>
        <option value="completed" className="bg-slate-900 text-white">Completed</option>
      </select>
      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Save Task
      </button>
    </form>
  );
}
