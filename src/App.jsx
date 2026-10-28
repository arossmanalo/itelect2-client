import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchTasks() {
  const response = await fetch(`${API_URL}/api/tasks`);

  if (!response.ok) {
    throw new Error(`GET /api/tasks answered ${response.status}`);
  }

  return response.json();
}

function getUserIdFromToken(token) {
  const payloadPart = token.split(".")[1];
  const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(
    Math.ceil(base64.length / 4) * 4,
    "="
  );

  return JSON.parse(atob(paddedBase64)).id;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loggedInAs, setLoggedInAs] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function logIn(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Login failed with status ${response.status}`);
    }

    setToken(data.token);
    setUserId(getUserIdFromToken(data.token));
    setLoggedInAs(email);
  }

  function logOut() {
    setToken("");
    setUserId(null);
    setLoggedInAs("");
  }

  async function reloadTasks() {
    const data = await fetchTasks();
    setTasks(data);
    setError("");
  }

  return (
    <main className="task-manager">
      <h1>My Tasks</h1>

      {token ? (
        <p className="who">
          <span>Logged in as {loggedInAs}</span>
          <button type="button" onClick={logOut}>Log out</button>
        </p>
      ) : (
        <LoginForm onLogin={logIn} />
      )}

      {token && userId !== null && (
        <TaskForm
          token={token}
          userId={userId}
          onTaskCreated={reloadTasks}
        />
      )}

      {loading && <p className="count">Loading tasks...</p>}

      {error && (
        <p className="error">Could not load tasks: {error}</p>
      )}

      {!loading && !error && (
        <>
          <p className="count">{tasks.length} tasks</p>
          <TaskList tasks={tasks} />
        </>
      )}
    </main>
  );
}

export default App;