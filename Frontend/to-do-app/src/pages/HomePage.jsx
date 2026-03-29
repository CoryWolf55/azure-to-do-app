import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/homepage.css";

const TASKS_API_URL = "http://localhost:5033/tasks";
// Initial tasks to show before API data loads for example
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
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDetails, setNewTaskDetails] = useState("");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [isCreatingTask, setIsCreatingTask] = useState(false);


    const fetchTasks = async () => {
        try {
            const response = await axios.get(TASKS_API_URL);
            setTasks(
                response.data.map((task) => ({
                    ...task,
                    expanded: false,
                    completed: task.completed || task.isComplete || false,
                }))
            );
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

    const toggleCompleted = async (id) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        const newCompletionStatus = !task.completed;

        setTasks((currentTasks) =>
            currentTasks.map((t) =>
                t.id === id ? { ...t, completed: newCompletionStatus } : t
            )
        );

        try {
            await axios.put(`${TASKS_API_URL}/update/${id}`, {
                IsComplete: newCompletionStatus,
            });
        } catch (error) {
            console.error(error);
            setTasks((currentTasks) =>
                currentTasks.map((t) =>
                    t.id === id ? { ...t, completed: !newCompletionStatus } : t
                )
            );
        }
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

    const handleCreateTask = async (event) => {
        event.preventDefault();

        const trimmedTitle = newTaskTitle.trim();
        const trimmedDetails = newTaskDetails.trim();

        if (!trimmedTitle) {
            return;
        }

        // Create task via API and add to local state immediately
        try {
            setIsCreatingTask(true);

            const payload = await axios.post(`${TASKS_API_URL}/create`, {
                Title: trimmedTitle,
                Description: trimmedDetails || "No description provided.",
                DueDate: newTaskDueDate || null,
                IsComplete: false,
            });
            
            const newTaskId = payload.data.id;
            console.log("Task created with ID:", newTaskId);
            
            // Add the new task to the tasks list immediately
            const newTask = {
                id: newTaskId,
                title: trimmedTitle,
                details: trimmedDetails || "No description provided.",
                dueDate: newTaskDueDate || null,
                completed: false,
                expanded: false,
            };
            
            setTasks((currentTasks) => [newTask, ...currentTasks]);
            setNewTaskTitle("");
            setNewTaskDetails("");
            setNewTaskDueDate("");
            setIsCreateFormOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleCancelCreateTask = () => {
        setNewTaskTitle("");
        setNewTaskDetails("");
        setNewTaskDueDate("");
        setIsCreateFormOpen(false);
    };

    const formatDueDate = (dueDate) => {
        if (!dueDate) {
            return "";
        }

        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleDateString();
    };

    return (
        <div className="home-page">
            <h1>Welcome to the To-Do App!</h1>
            <p>Organize your tasks and boost your productivity.</p>

            <div className="task-box">
                <div className="task-box-header">
                    <h2 className="task-box-title">Today&apos;s Tasks</h2>
                    <button
                        type="button"
                        className="create-task-button"
                        onClick={() => setIsCreateFormOpen((isOpen) => !isOpen)}
                    >
                        {isCreateFormOpen ? "Close" : "Create Task"}
                    </button>
                </div>

                {isCreateFormOpen && (
                    <form className="create-task-form" onSubmit={handleCreateTask}>
                        <label htmlFor="task-title">Task title</label>
                        <input
                            id="task-title"
                            type="text"
                            value={newTaskTitle}
                            onChange={(event) => setNewTaskTitle(event.target.value)}
                            placeholder="Enter a task title"
                            disabled={isCreatingTask}
                            required
                        />

                        <label htmlFor="task-details">Task details</label>
                        <textarea
                            id="task-details"
                            value={newTaskDetails}
                            onChange={(event) => setNewTaskDetails(event.target.value)}
                            placeholder="Add details (optional)"
                            rows={3}
                            disabled={isCreatingTask}
                        />

                        <label htmlFor="task-due-date">Due date</label>
                        <input
                            id="task-due-date"
                            type="date"
                            value={newTaskDueDate}
                            onChange={(event) => setNewTaskDueDate(event.target.value)}
                            disabled={isCreatingTask}
                        />

                        <div className="create-task-actions">
                            <button type="submit" className="submit-task-button" disabled={isCreatingTask}>
                                {isCreatingTask ? "Adding..." : "Add Task"}
                            </button>
                            <button
                                type="button"
                                className="cancel-task-button"
                                onClick={handleCancelCreateTask}
                                disabled={isCreatingTask}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

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

                            {task.expanded && (
                                <>
                                    <p className="task-details">{task.details}</p>
                                    {formatDueDate(task.dueDate) && (
                                        <p className="task-due-date">Due: {formatDueDate(task.dueDate)}</p>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HomePage;