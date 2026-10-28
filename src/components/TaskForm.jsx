import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function TaskForm({ token, userId, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle === "") return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTitle,
          dueDate: new Date().toISOString(),
          completed: false,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `POST /api/tasks answered ${response.status}`);
      }

      await onTaskCreated();
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="New task title"
        placeholder="Enter a task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add task</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default TaskForm;