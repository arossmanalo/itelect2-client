import { useState } from "react";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle === "") return;

    onAdd(trimmedTitle);
    setTitle("");
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
    </form>
  );
}

export default TaskForm;