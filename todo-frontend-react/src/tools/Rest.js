import { parentIdThenIdComparator } from "./Tools";

const getAllError = "Error when fetching all todos";
const getError = "Error when fetching todo";
const createError = "Error on creating todo";
const updateError = "Error on updating todo";
const deleteError = "Error on deleting todo";

const todoBaseUrl = "http://localhost:5120/todo/";

export const getTodoList = async () => {
  const response = await fetch(todoBaseUrl);
  if (!response.ok) {
    throw new Error(getAllError);
  }
  var data = await response.json();
  data = data.map((item) => {
    return { ...item, deadline: new Date(item.deadline) };
  });
  data = data.sort(parentIdThenIdComparator);
  return data;
};

export const getTodo = async (id) => {
  const response = await fetch(todoBaseUrl + id);
  if (!response.ok) {
    throw new Error(getError);
  }
  var data = await response.json();
  data = { ...data, deadline: new Date(data.deadline) };
  return data;
};

export const createTodo = async (data) => {
  const response = await fetch(todoBaseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
  console.log(response)
  if (!response.ok) {
    throw new Error(createError);
  }
};

export const updateStatus = async (id, newState) => {
  const response = await fetch(todoBaseUrl + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: newState,
  });

  if (!response.ok) {
    throw new Error(updateError);
  }
};

export const deleteTodo = async (id) => {
  const response = await fetch(todoBaseUrl + id, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(deleteError);
  }
};
