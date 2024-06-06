import React, { useEffect, useState } from "react";
import { getTodoList } from "../tools/Rest";
import { useNavigate } from 'react-router-dom';

import TodoItem from "./TodoItem";

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getTodos = async () => {
      try {
        const data = await getTodoList();
        setTodoList(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    getTodos();
  }, []);
  const handleCheck = (id) => {
    const index = todoList.findIndex((todo) => todo.id === id);
    const updatedTodoList = [...todoList];
    updatedTodoList[index] = {
      ...updatedTodoList[index],
      completed: !updatedTodoList[index].completed,
    };
    setTodoList(updatedTodoList);
  };

  const handleDelete = (id) => {
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedTodoList);
  };
  
  const navigate = useNavigate();
  const redirectToView = () => {
    navigate("/todo");
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
          onClick={redirectToView}
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
            <TodoItem
              key={index}
              item={item}
              onCheck={handleCheck}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
