import React, { useEffect, useState } from "react";
import { deleteTodo, getTodoList, updateStatus } from "../tools/Rest";
import { useNavigate } from "react-router-dom";
import TodoListItem from "./TodoListItem";

const TodoList = () => {
  const navigate = useNavigate();
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setTodoList(await getTodoList());
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    init();
  }, []);

  // Mark Complete
  const handleMarkComplete = (id) => {
    const index = todoList.findIndex((todo) => todo.id === id);
    const updatedTodoList = [...todoList];
    try {
      updatedTodoList[index] = {
        ...updatedTodoList[index],
        completed: !updatedTodoList[index].completed,
      };
      updateStatus(id, updatedTodoList[index].completed);
      
      if (updatedTodoList[index].completed) {
        if (updatedTodoList[index].parentId) {
          checkSiblingsAndUpdateParent(updatedTodoList, updatedTodoList[index]);
        } else {
          updateChildren(updatedTodoList, updatedTodoList[index]);
        }
      }
      setTodoList(updatedTodoList);
    } catch (err) {
      setError(err);
    }
  };

  const checkSiblingsAndUpdateParent = (todoList, toUpdate) => {
    const parent = todoList.find((x) => x.id === toUpdate.parentId);
    const siblings = todoList.filter(
      (x) => x.parentId === parent.id && x.id !== toUpdate.id
    );
    const updateParent = siblings.every((x) => x.completed);

    if (updateParent && !parent.completed) {
      const parentIndex = todoList.findIndex((x) => x.id === parent.id);
      todoList[parentIndex] = { ...parent, completed: true };
    }
  };

  const updateChildren = (todoList, toUpdate) => {
    const children = todoList.filter((x) => x.parentId === toUpdate.id);
    children.forEach((child) => {
      if (!child.completed) {
        const childIndex = todoList.findIndex((x) => x.id === child.id);
        todoList[childIndex] = { ...child, completed: true };
      }
    });
  };

  // Delete
  const handleDelete = (id) => {
    deleteTodo(id);

    var updatedTodoList = todoList;
    updatedTodoList = updatedTodoList.filter((todo) => todo.id !== id);
    updatedTodoList = updatedTodoList.filter((todo) => todo.parentId !== id);
    setTodoList(updatedTodoList);
  };

  // Nav
  const handleCreate = () => {
    navigate("/todo/create");
  };
  const handleCreateChild = (parentId) => {
    console.log(parentId);
    navigate("/todo/" + parentId + "/create");
  };
  const handleView = (id) => {
    navigate("/todo/" + id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h4 className="text-center my-3 pb-3">Todo List</h4>
      <div>
        <button
          onClick={handleCreate}
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="btn btn-primary"
        >
          New Todo
        </button>
      </div>

      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" colSpan="3">
              Todo item
            </th>
            <th scope="col" style={{ minWidth: "100px" }}>
              Due Date
            </th>
            <th scope="col" style={{ minWidth: "100px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {todoList.map((item, index) => (
            <TodoListItem
              key={index}
              item={item}
              onCheck={handleMarkComplete}
              onDelete={handleDelete}
              onView={handleView}
              onCreateChild={handleCreateChild}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
