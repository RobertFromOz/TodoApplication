import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTodo } from "../tools/Rest";

const TodoCreate = () => {
  const navigate = useNavigate();
  const { parentId } = useParams();
  const [formData, setFormData] = useState({
    task: "",
    deadline: "",
    details: "",
    parentId: parentId ? parentId : null,
  });
  const [error, setError] = useState(null);

  // nav
  const handleBack = () => {
    navigate("/todo");
  };

  // form 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(JSON.stringify(formData))
      await createTodo(JSON.stringify(formData));
      handleBack();
    } catch (err) {
      setError(err);
    }
  };

  const isFormValid = () => {
    return formData.task !== "" && formData.deadline !== "";
  };

  return (
    <div>
      {error && <div className="text-center my-3 pb-3">{error.message}</div>}
      <h4 className="text-center my-3 pb-3">Create New Todo</h4>

      <div>
        <button
          onClick={handleBack}
          data-mdb-button-init
          data-mdb-ripple-init
          className="btn btn-danger"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task">Task:</label>
          <input
            className="form-control"
            type="text"
            id="task"
            name="task"
            value={formData.task}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline:</label>
          <input
            className="form-control"
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="details">Details:</label>
          <textarea
            className="form-control"
            type="text"
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
          />
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid()}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoCreate;
