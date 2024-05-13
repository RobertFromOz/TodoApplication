class TodoService
{
    
    static private long idCounter = 0;
    static public long IdCounter { get => idCounter++; }
    private List<Todo> todoList = new List<Todo>();
    
    public TodoService(bool blank = false)
    {
        if(!blank) 
        {
            // Default database
            todoList.Add(new Todo("Task A", DateTime.Now.AddDays(-1), "A Description"));
            todoList.Add(new Todo("Task B", DateTime.Now.AddDays(1), "B Description"));
            todoList.Add(new Todo("Sub Task 1", DateTime.Now.AddDays(-1), "Sub Task 1 Description", todoList[1].Id));
            todoList.Add(new Todo("Sub Task 2", DateTime.Now.AddDays(1), "Sub Task 2 Description", todoList[1].Id));
            todoList.Add(new Todo("Task C", DateTime.Now, "C Description"));
            todoList.Add(new Todo("Sub Task 2", DateTime.Now, "Sub Task 2 Description", todoList[4].Id));
        }
    }

    public List<Todo> All()
    {
        return todoList;
    }

    public Todo? Get(long id)
    {
        return todoList.FirstOrDefault(x => x.Id == id);
    }

    public Todo Add(TodoAdd add)
    {
        var result = new Todo(
            add.task,
            add.deadline,
            add.details,
            add.parentId);

        todoList.Add(result);
        return result;
    }

    public bool UpdateComplete(long id, bool newState)
    {
        var updatedTodo = todoList.FirstOrDefault(x => x.Id == id);
        if (updatedTodo != null)
        {
            updatedTodo.Completed = newState;
            if (updatedTodo.Completed)
            {
                if (updatedTodo.ParentId.HasValue)
                {
                    return UpdateSiblings(updatedTodo);
                }
                else
                {
                    UpdateParent(updatedTodo);
                }
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    void UpdateParent(Todo toUpdate)
    {
        var children = todoList.Where(x => x.ParentId == toUpdate.Id);
        foreach (var child in children)
        {
            if (!child.Completed)
            {
                child.Completed = true;
            }
        }
    }

    bool UpdateSiblings(Todo toUpdate)
    {
        var parent = todoList.FirstOrDefault(x => x.Id == toUpdate.ParentId);
        if (parent == null)
        {
            return false;
        }

        var siblings = todoList.Where(x => x.ParentId == parent?.Id && x.ParentId != toUpdate.Id);
        var updateParent = true;
        foreach (var sibling in siblings)
        {
            if (!sibling.Completed)
            {
                updateParent = false;
                break;
            }
        }

        if (updateParent)
        {
            if (!parent.Completed)
            {
                parent.Completed = true;
            }
        }
        return true;
    }

    public void Delete(long id)
    {
        todoList.RemoveAll(x => x.Id == id);
        todoList.RemoveAll(x => x.ParentId == id);
    }
}

public class Todo
{

    public long? Id { get; set; }
    public string Task { get; set; }
    public DateTime Deadline { get; set; }
    public bool Completed { get; set; }
    public string? Details { get; set; }
    public long? ParentId { get; set; }

    public Todo(string task, DateTime deadline, string? details, long? parentId = null)
    {
        Id = TodoService.IdCounter;
        Task = task;
        Deadline = deadline;
        Completed = false;
        Details = details;
        ParentId = parentId;
    }
}

