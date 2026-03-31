import db from "../lib/db.js"
import crypto from "crypto";

export const createTask = async(req, res) => {
    const { title } = req.body;
    const userId = req.user.userId;

    if(!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
       await db.run(
        "INSERT INTO tasks (id, title, userId) VALUES (?, ?, ?)",
        [crypto.randomUUID(), title, userId]
       );
       
       res.json({ message: "Task created" })
    } catch (error) {
        res.status(400).json({ error: "Error creating task"})
    }
};

export const getTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const tasks = await db.all(
      "SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

export const toggleTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { title } = req.body;

  try {
    const task = await db.get(
      "SELECT * FROM tasks WHERE id = ? AND userId = ?",
      [id, userId]
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (typeof title === "string") {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return res.status(400).json({ error: "Title is required" });
      }

      await db.run(
        "UPDATE tasks SET title = ? WHERE id = ? AND userId = ?",
        [trimmedTitle, id, userId]
      );

      return res.json({ message: "Task title updated" });
    }

    const newStatus = task.completed ? 0 : 1;

    await db.run(
      "UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?",
      [newStatus, id, userId]
    );

    res.json({ message: "Task updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await db.run(
      "DELETE FROM tasks WHERE id = ? AND userId = ?",
      [id, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};
