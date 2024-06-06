import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTodo } from "../tools/Rest";
import { formatDate } from "../tools/Tools";
import { useNavigate } from "react-router-dom";

const TodoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setTodo(await getTodo(id));
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    init();
  }, [id]);
  
  const handleBack = () => {
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
      <h4 className="text-center my-3 pb-3">Todo View</h4>

      <div>
        <button
          onClick={handleBack}
          data-mdb-button-init
          data-mdb-ripple-init
          className="btn btn-primary"
        >
          Back
        </button>
      </div>

      <table className="table mb-4">
        <tbody>
          <tr>
            <th>Id</th>
            <td>{todo.id}</td>
          </tr>
          <tr>
            <th>Task</th>
            <td>{todo.task}</td>
          </tr>
          <tr>
            <th>Deadline</th>
            <td>{formatDate(todo.deadline)}</td>
          </tr>
          <tr>
            <th>Completed</th>
            <td>{todo.completed ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th>Details</th>
            <td className="preformatted">{todo.details}</td>
          </tr>
          {todo.parentId && (
            <tr>
              <th>Parent</th>
              <td>{todo.parentId}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoView;
