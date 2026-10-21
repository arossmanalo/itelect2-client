import { useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import "./App.css";

const STARTING_TASKS = [
  { id: 1, title: "Finish the React client", dueDate: "2026-10-21" },
  { id: 2, title: "Review TaskList props", dueDate: "2026-10-22" },
  { id: 3, title: "Practice controlled inputs", dueDate: "2026-10-23" },
];

function App() {
  const [tasks, setTasks] = useState(STARTING_TASKS);

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      dueDate: new Date().toISOString().slice(0, 10),
    };

    setTasks([...tasks, newTask]);
  }

  return (
    <main className="task-manager">
      <h1>My Tasks</h1>
      <p className="task-count">{tasks.length} tasks</p>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;