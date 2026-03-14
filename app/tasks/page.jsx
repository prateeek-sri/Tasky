"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { ListTodo } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TasksPage() {
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleTaskCreated = () => {
    setRefreshToggle(!refreshToggle);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
          <ListTodo className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-gray-400">Create, track, and secure your daily tasks.</p>
        </div>
      </div>

      <TaskForm onTaskCreated={handleTaskCreated} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <TaskList refreshToggle={refreshToggle} />
      </div>
    </div>
  );
}
