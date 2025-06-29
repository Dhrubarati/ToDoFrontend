import "./styles.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Fetching the task
  const fetchTask = async (token) => {
    const response = await fetch(
      "https://todobackend-y0yl.onrender.com/tasks",
      {
        header: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log("Fetched tasks", data);

    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTask(token);
  }, [token]);

  // logout
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  // Adding new task for the user
  const addTasks = async (text) => {
    const response = await fetch(
      "https://todobackend-y0yl.onrender.com/tasks",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, status: "pending", priority: "medium" }),
      }
    );
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`https://todobackend-y0yl.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTasks(tasks.filter((task) => task._id != id));
  };

  // Updation of status
  const updateTasksStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "complete" : "pending";
    const response = await fetch(
      `https://todobackend-y0yl.onrender.com/tasks/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const updatedTask = await response.json();
    setTasks(task.map((task) => (task._id === id ? updatedTask : task)));
  };

  // Updation of priority
  const updateTasksPriority = async (id, newPriority) => {
    const response = await fetch(
      `https://todobackend-y0yl.onrender.com/tasks/${id}/priority`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      }
    );
    const updatedTask = await response.json();
    setTasks(task.map((task) => (task._id === id ? updatedTask : task)));
  };

  // Filtering task
  const filterTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );
  const MainApp = () => {
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-centershadow">
        <ul className="flex space-x-4">
          <li>
            <a
              href="#"
              className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-orange-600 hover:text-white focus: bg-orange-700 focus:outline-none"
            >
              Home
            </a>
          </li>
        </ul>
        <button
          className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-orange-600 hover:text-white focus: bg-orange-700 focus:outline-none shadow-sm"
          onClick={logout}
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-orange">
          MERN To-do App
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
        >
          <input
            type="text"
            className="p-3 border-2 border-orange-300 rounded-lg w-2/3 focus:outline-none"
            placeholder="Ädd a task"
          />
          <button
            className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-orange-600 hover:text-white focus: bg-orange-700 focus:outline-none shadow-sm"
            onClick={logout}
          >
            Add
          </button>
        </form>
        <div className="mb-6 flex gap-4 justify-center">
          <select
            onChange={(e) => {
              setFilterStatus(e.target.value);
            }}
            value={filterStatus}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <select
            onChange={(e) => {
              setFilterPriority(e.target.value);
            }}
            value={filterPriority}
          >
            <option value="all">All priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <ul className="space-y-4">
          {filteredTasks.map(task)=>{
            <li key={task._id} className="p-4 bg-white rounded-xl shadow flex flex-col md:flex-row md:item-center md:justify-center gap-4">
              <div className="flex-1"><span className="text-lg text-orange-800">{task.text}</span>
              <span className="ml-2 text-sm text-gray-500">{{task.status},{task.priority}}</span>
              </div>
              <div className="flex gap-2 item-center">
                <button onClick={()=>updateTasksStatus(task._id,task.status)}></button>
              </div>
            </li>
          }};
        </ul>
      </main>
    </div>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}
