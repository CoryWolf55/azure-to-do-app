namespace Task_API.DTOs
{

    //Mapping DTOS

    public static class TaskMappingDTO
    {
        public static TaskReturnDTO ToDTO(this Models.TaskItem task)
        {
            return new TaskReturnDTO
            {
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                IsComplete = task.IsComplete
            };
        }
    }
    public class TaskReturnDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsComplete { get; set; }

    }

    public class TaskCreateDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsComplete { get; set; }

    }

}
