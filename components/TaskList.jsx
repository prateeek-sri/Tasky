"use client";

import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";

export default function TaskList({ refreshToggle }) {

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {

    const query = new URLSearchParams({
      search,
      status,
      page,
      limit
    });

    fetch(`/api/tasks?${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(data.data);
          setTotalPages(data.totalPages || 1);
        }
      });

  }, [search, status, page, refreshToggle]);



  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });

    setTasks(tasks.filter(t => t._id !== id));
  };



  const updateStatus = async (id, newStatus) => {

    const previousTasks = [...tasks];

    setTasks(
      tasks.map(t =>
        t._id === id ? { ...t, status: newStatus } : t
      )
    );

    try {

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed");

    } catch (err) {

      console.error(err);
      setTasks(previousTasks);

    }
  };



  return (
    <div className="space-y-4">

      {/* SEARCH + FILTER */}

      <div className="flex gap-3">

        <div className="relative flex-1">

          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />

          <input
            placeholder="Search by title..."
            className="input-field w-full pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

        </div>


        <select
          className="input-field"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >

          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>

        </select>

      </div>



      {/* TASK LIST */}

      <div className="grid gap-3">

        {tasks.map((task) => (

          <div
            key={task._id}
            className="glass-card p-4 flex justify-between items-center group"
          >

            <div className="flex-1">

              <h3 className="font-bold text-indigo-400">
                {task.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {task.description}
              </p>

            </div>


            <div className="flex items-center gap-3">

              <select
                className={`text-xs px-3 py-1.5 rounded bg-slate-900 border cursor-pointer outline-none transition-colors min-w-[110px]
                ${
                  task.status === "completed"
                    ? "border-green-500/50 text-green-400"
                    : task.status === "in-progress"
                    ? "border-yellow-500/50 text-yellow-400"
                    : "border-gray-600/50 text-gray-300"
                }`}
                value={task.status}
                onChange={(e) =>
                  updateStatus(task._id, e.target.value)
                }
              >

                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>

              </select>



              <button
                onClick={() => deleteTask(task._id)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >

                <Trash2 className="w-4 h-4" />

              </button>

            </div>

          </div>

        ))}

      </div>



      {/* PAGINATION */}

      <div className="flex justify-between items-center pt-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-indigo-500 rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-indigo-500 rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>
  );
}