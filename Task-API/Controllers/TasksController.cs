using Microsoft.AspNetCore.Mvc;
using Task_API.Models;
using System.Linq;

namespace Task_API.Controllers
{

    [ApiController]
    [Route("/[controller]")]
    public class TasksController : ControllerBase
    {
        ///<summary>
        /// Simple task controller that allows you do to basic calls to create, read, update and delete tasks.
        /// Can easily add more calls later. 
        /// 
        /// To-Do: (some will not be added due to the simplicity of the project, but are good to have in a real application)
        /// Add more functionality such as filtering tasks by completion status, due date, etc.
        /// Need to add DTOs and validation for better data handling and error management.
        /// Rate Limiting and Authentication should be added for better security and performance.
        /// 
        ///</summary>
        

        //Just using in-memory list for simplicity
        private static List<TaskItem> tasks = new List<TaskItem>();

        [HttpGet]
        public ActionResult<List<TaskItem>> GetAll()
        {
            return Ok(tasks);
        }

        [HttpPost]
        public ActionResult<TaskItem> Create(TaskItem task)
        {
            task.Id = tasks.Count + 1; // Simple ID generation since im not using a database
            tasks.Add(task);
            return Ok();
        }

        [HttpPut("{id}")] // Update task by ID, Only using ID in route for simplicity
        public IActionResult Update(int id, TaskItem updatedTask)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }

            task.IsComplete = updatedTask.IsComplete;
            return Ok();
        }

        [HttpDelete("{id}")] // Delete task by ID, Only using ID in route for simplicity
        public IActionResult Delete(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }
            tasks.Remove(task);
            return Ok();
        }
    }
}
