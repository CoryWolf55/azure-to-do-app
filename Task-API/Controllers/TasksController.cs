using Microsoft.AspNetCore.Mvc;
using Task_API.Models;
using System.Linq;
using Task_API.DTOs;

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


        [HttpGet("{id}")] // Get task by ID
        public ActionResult<TaskReturnDTO> GetById(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(TaskMappingDTO.ToDTO(task));
        }

        [HttpPost("create")]
        public ActionResult<TaskReturnDTO> Create(TaskCreateDTO taskDto)
        {
            // Map the incoming DTO to your Model
            var newTask = new TaskItem
            {
                Id = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1,
                Title = taskDto.Title,
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                IsComplete = false // Default to false on creation
            };

            tasks.Add(newTask);

            //var returnDto = TaskMappingDTO.ToDTO(newTask); #Removed due to the need for index in frontend

            return Ok(newTask);
        }

        [HttpPut("update/{id}")] // Update task by ID, Only using ID in route for simplicity
        public IActionResult Update(int id, bool IsComplete)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }

            task.IsComplete = IsComplete;
            Console.WriteLine("This is the task found" + task);
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
