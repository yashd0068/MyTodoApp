import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function TodoCard({ todo, onDelete, onToggle }) {
  const navigate = useNavigate();

  const handleToggle = async () => {
    const action = todo.is_completed ? "marked as pending" : "completed ";
    await onToggle(todo.todo_id, !todo.is_completed);
    toast.success(`Todo ${action}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this todo?");
    if (!confirmed) return;
    await onDelete(todo.todo_id);
    toast.success("Todo deleted ");
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{todo.title}</h2>

      <p className="text-gray-600 mb-3">
        {todo.description || "No description provided."}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        <strong>Due:</strong>{" "}
        {todo.due_date
          ? new Date(todo.due_date).toLocaleDateString()
          : "Not set"}
      </p>

      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${todo.is_completed
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {todo.is_completed ? "Completed" : "Pending"}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            className={`px-3 py-1 rounded text-xs font-medium transition ${todo.is_completed
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {todo.is_completed ? "Mark Pending" : "Mark Done"}
          </button>

          <button
            onClick={() => navigate(`/edit/${todo.todo_id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
