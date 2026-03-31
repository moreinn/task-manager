import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const { user, logout } = useAuthStore();

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title: title.trim() },
        { withCredentials: true }
      );

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const saveTaskTitle = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: editingTitle.trim() },
        { withCredentials: true }
      );

      cancelEditing();
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        withCredentials: true,
      });

      if (editingTaskId === id) {
        cancelEditing();
      }

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        { withCredentials: true }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="center app-shell">
      <div className="card dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1>Task Manager</h1>
            <p className="dashboard-subtitle">
              Welcome, <b>{user?.email || user?.name || user?.userId}</b>
            </p>
          </div>

          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="input-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add new task..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createTask();
              }
            }}
          />
          <button className="add-button" onClick={createTask}>
            Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one below.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => {
              const isEditing = editingTaskId === task.id;

              return (
                <div className="task-item" key={task.id}>
                  <div className="task-main">
                    {isEditing ? (
                      <input
                        className="task-edit-input"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveTaskTitle(task.id);
                          }

                          if (e.key === "Escape") {
                            cancelEditing();
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <button
                        className={`task-title ${
                          task.completed ? "completed" : ""
                        }`}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.title}
                      </button>
                    )}
                  </div>

                  <div className="task-actions">
                    {isEditing ? (
                      <>
                        <button
                          className="action-button save-button"
                          onClick={() => saveTaskTitle(task.id)}
                        >
                          Save
                        </button>
                        <button
                          className="action-button cancel-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="action-button edit-button"
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="action-button delete-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
