import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function TodoCard({ todo, onDelete, onToggle }) {
  const navigate = useNavigate();

  const handleToggle = async () => {
    const action = todo.is_completed ? "marked as pending" : "completed";
    await onToggle(todo.todo_id, !todo.is_completed);
    toast.success(`Todo ${action}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this todo?");
    if (!confirmed) return;
    await onDelete(todo.todo_id);
    toast.success("Todo deleted");
  };

  return (
    <div className="bg-[#1F2937] border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">

      {/* Title */}
      <h2 className="text-lg font-semibold text-[#E6EAF2] mb-2 truncate">
        {todo.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-300 mb-4 line-clamp-3">
        {todo.description || "No description provided."}
      </p>

      {/* Due date */}
      <p className="text-xs text-slate-400 mb-4">
        Due: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "Not set"}
      </p>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        {/* Status */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${todo.is_completed
            ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
            : "border-amber-400/40 text-amber-300 bg-amber-500/10"
            }`}
        >
          {todo.is_completed ? "Completed" : "Pending"}
        </span>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleToggle}
            className="px-3 py-1 text-xs rounded-full border border-indigo-400/40 text-indigo-300 hover:bg-indigo-400/20 transition"
          >
            {todo.is_completed ? "Undo" : "Done"}
          </button>

          <button
            onClick={() => navigate(`/edit/${todo.todo_id}`)}
            className="px-3 py-1 text-xs rounded-full bg-indigo-500/90 hover:bg-indigo-500 text-white transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1 text-xs rounded-full bg-red-500/80 hover:bg-red-500 text-white transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
