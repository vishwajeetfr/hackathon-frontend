import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import StudentPage from "./pages/student";
import TeacherPage from "./pages/teacher";
import CreateSubmission from "./pages/createsubmission";
import MyAssignments from "./pages/myassignments";
import ViewSubmission from "./pages/viewsubmission";
import StudentSubmissions from "./pages/studentsubmissions";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="student" element={<StudentPage />} />
        <Route path="teacher" element={<TeacherPage />} />
        <Route path="createsubmission" element={<CreateSubmission />} />
        <Route path="viewsubmission" element={<ViewSubmission />} />
        <Route path="myassignments" element={<MyAssignments />} />
        <Route path="studentsubmissions" element={<StudentSubmissions />} />
      </Route>
    </Routes>
  </Router>
);
