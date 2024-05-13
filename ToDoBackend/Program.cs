using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
    
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo { Title = "ToDo API", Description = "Backend for ToDo List Project", Version = "v1" });
});


var corsSetting = "corsSetting";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsSetting,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200","http://localhost:4200/todo/*")
                .AllowAnyHeader()
                .WithMethods("GET", "POST", "DELETE", "PUT");
        });
});

var app = builder.Build();
app.UseCors(corsSetting);

if (app.Environment.IsDevelopment())
{
   app.UseSwagger();
   app.UseSwaggerUI(c =>
   {
      c.SwaggerEndpoint("/swagger/v1/swagger.json", "ToDo API V1");
   });
}

TodoService toDoService = new TodoService();

// get all
app.MapGet("/todo", () => {

    var result = toDoService.All();
    return Results.Ok(result);
});

// get single
app.MapGet("/todo/{id}", (long id) => {

     var result = toDoService.Get(id);
     if (result == null)
     {
         return Results.NotFound();
     }
     return Results.Ok(result);
 });

// add new
app.MapPost("/todo", ([FromBody] TodoAdd add) =>
{
    var errors = new List<string>();
    if (string.IsNullOrEmpty(add.task)) errors.Add("Missing Task");
    if (add.deadline == default) errors.Add("Missing Deadline");
    
    
    if(add.parentId != null){
        var parent = toDoService.All().FirstOrDefault(x => x.Id == add.parentId);
        if (parent == null) errors.Add("Parent not found");
        if (parent != null && parent.ParentId != null) errors.Add("Parent already is a child");
    }

    
    if (errors.Any())
    {
        return Results.BadRequest(errors);
    }
    var result = toDoService.Add(add);

    return Results.Created($"/todo/{result.Id}", result);
});

// update completed status
app.MapPut("/todo/{id}", (long id, [FromBody] bool update) =>
{
    if (!toDoService.UpdateComplete(id, update))
    {
        return Results.NotFound();
    }
    return Results.Ok();
});

// delete
app.MapDelete("/todo/{id}", (long id) => 
{
    toDoService.Delete(id);
    return Results.NoContent();
});


app.Run();


record TodoAdd (string task, DateTime deadline, string? details, long? parentId = null);