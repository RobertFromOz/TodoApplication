import TodoList from "./todo/TodoList";
import TodoCreate from "./todo/TodoCreate";
import TodoView from "./todo/TodoView";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";

const App = () => {
  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-9 col-xl-7">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <Router>
                  <Routes>
                    <Route exact path="/" element={<Navigate to="/todo" />} />
                    <Route exact path="/todo" element={<TodoList />} />
                    <Route exact path="/todo/create" element={<TodoCreate />} />
                    <Route
                      exact
                      path="/todo/:parentId/create"
                      element={<TodoCreate />}
                    />
                    <Route exact path="/todo/:id" element={<TodoView />} />
                  </Routes>
                </Router>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
