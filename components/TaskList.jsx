"use client";

import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";

export default function TaskList({ refreshToggle }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/tasks?search=${search}`)
      .then(res => res.json())
      .then(data => data.success && setTasks(data.data));
  }, [search, refreshToggle]);

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t._id !== id));
  };

  const updateStatus = async (id, newStatus) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error(err);
      setTasks(previousTasks); // Revert on failure
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
        <input
          placeholder="Search by title..."
          className="input-field w-full pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <div key={task._id} className="glass-card p-4 flex justify-between items-center group">
            <div className="flex-1">
              <h3 className="font-bold text-indigo-400">{task.title}</h3>
              <p className="text-gray-400 text-sm">{task.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className={`text-xs px-3 py-1.5 rounded bg-slate-900 border cursor-pointer outline-none transition-colors min-w-[110px] ${
                  task.status === 'completed' ? 'border-green-500/50 text-green-400' : 
                  task.status === 'in-progress' ? 'border-yellow-500/50 text-yellow-400' : 'border-gray-600/50 text-gray-300'
                }`}
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                <option value="pending" className="bg-slate-900 text-white">Pending</option>
                <option value="in-progress" className="bg-slate-900 text-white">In Progress</option>
                <option value="completed" className="bg-slate-900 text-white">Completed</option>
              </select>
              <button 
                onClick={() => deleteTask(task._id)} 
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
