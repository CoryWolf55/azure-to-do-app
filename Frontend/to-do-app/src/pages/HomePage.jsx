import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/homepage.css";

const initialTasks = [
    {
        id: 1,
        title: "Plan tomorrow",
        details: "Write your top three priorities for the day before you log off.",
        completed: false,
        expanded: false,
    },
    {
        id: 2,
        title: "Review pull requests",
        details: "Check pending PRs, leave comments, and merge anything approved.",
        completed: false,
        expanded: false,
    },
    {
        id: 3,
        title: "Update project board",
        details: "Move finished tasks to done and reorder the next items to tackle.",
        completed: false,
        expanded: false,
    },
];

function HomePage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [draggedTaskId, setDraggedTaskId] = useState(null);


    const fetchTasks = async () => {
        try {
        const response = await axios.get("https://localhost:5001/api/tasks");
        setTasks(response.data);
    } catch (error) {
        console.error(error);
        }
    };

    //Fetch tasks from API at startup
    useEffect(() => {
        fetchTasks();
    }, []);


    const toggleExpanded = (id) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? { ...task, expanded: !task.expanded } : task
            )
        );
    };

    const toggleCompleted = (id) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDrop = (targetTaskId) => {
        if (draggedTaskId === null || draggedTaskId === targetTaskId) {
            return;
        }

        setTasks((currentTasks) => {
            const updatedTasks = [...currentTasks];
            const fromIndex = updatedTasks.findIndex((task) => task.id === draggedTaskId);
            const toIndex = updatedTasks.findIndex((task) => task.id === targetTaskId);

            if (fromIndex === -1 || toIndex === -1) {
                return currentTasks;
            }

            const [movedTask] = updatedTasks.splice(fromIndex, 1);
            updatedTasks.splice(toIndex, 0, movedTask);

            return updatedTasks;
        });

        setDraggedTaskId(null);
    };

    return (
        <div className="home-page">
            <h1>Welcome to the To-Do App!</h1>
            <p>Organize your tasks and boost your productivity.</p>

            <div className="task-box">
                <h2 className="task-box-title">Today&apos;s Tasks</h2>
                <ul className="task-list">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`task-item ${task.completed ? "completed" : ""}`}
                            draggable
                            onDragStart={() => setDraggedTaskId(task.id)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => handleDrop(task.id)}
                            onDragEnd={() => setDraggedTaskId(null)}
                        >
                            <div className="task-row">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleCompleted(task.id)}
                                    aria-label={`Mark ${task.title} complete`}
                                />
                                <button
                                    type="button"
                                    className="task-title"
                                    onClick={() => toggleExpanded(task.id)}
                                >
                                    <span>{task.title}</span>
                                    <span className="expand-icon">{task.expanded ? "-" : "+"}</span>
                                </button>
                            </div>

                            {task.expanded && <p className="task-details">{task.details}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HomePage;