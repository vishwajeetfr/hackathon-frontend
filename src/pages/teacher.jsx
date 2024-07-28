import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Link,
} from "@mui/material";

function TeacherPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [classType, setClassType] = useState("11th");
  const [createdBy, setCreatedBy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [viewSection, setViewSection] = useState("none"); // "addAssignment", "viewAssignments", "updateAssignment"
  const [currentAssignment, setCurrentAssignment] = useState(null); // For tracking the assignment being updated
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    setCreatedBy(username || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("class");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSubmit = async (event) => {
    setFeedback("");
    event.preventDefault();

    if (!title || !description || !dueDate || !classType || !createdBy) {
      setFeedback("Please fill in all required fields.");
      return;
    }

    const newAssignment = {
      attachmentUrl,
      clazz: classType,
      createdBy,
      description,
      dueDate: dueDate.toISOString().split("T")[0],
      title,
    };

    const token = localStorage.getItem("jwtToken");

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/assignments", newAssignment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedback("Assignment created successfully!");
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setAttachmentUrl("");
      setClassType("11th");
      setCreatedBy(localStorage.getItem("username") || "");
      fetchAssignments(); // Refresh the list after adding new assignment
    } catch (error) {
      setFeedback("Error creating assignment. Please try again.");
      console.error("Error creating assignment:", error);
    } finally {
      setLoading(false);
      setViewSection("none"); // Hide the form after submission
    }
  };

  const fetchAssignments = async () => {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");
    try {
      const response = await axios.get(
        `http://localhost:8080/assignments/teacher/username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(response.data);
      setViewSection("viewAssignments");
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleUpdateAssignment = (assignment) => {
    setCurrentAssignment(assignment);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(new Date(assignment.dueDate));
    setAttachmentUrl(assignment.attachmentUrl);
    setClassType(assignment.clazz);
    setCreatedBy(assignment.createdBy);
    setViewSection("updateAssignment");
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !dueDate || !classType || !createdBy) {
      setFeedback("Please fill in all required fields.");
      return;
    }

    const updatedAssignment = {
      attachmentUrl,
      clazz: classType,
      createdBy,
      description,
      dueDate: dueDate.toISOString().split("T")[0],
      title,
    };

    const token = localStorage.getItem("jwtToken");

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/assignments/${currentAssignment.id}`,
        updatedAssignment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedback("Assignment updated successfully!");
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setAttachmentUrl("");
      setClassType("11th");
      setCreatedBy(localStorage.getItem("username") || "");
      setCurrentAssignment(null);
      fetchAssignments(); // Refresh the list after update
    } catch (error) {
      setFeedback("Error updating assignment. Please try again.");
      console.error("Error updating assignment:", error);
    } finally {
      setLoading(false);
      setViewSection("none"); // Hide the form after update
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    const token = localStorage.getItem("jwtToken");

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/assignments/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedback("Assignment deleted successfully!");
      fetchAssignments(); // Refresh the list after deletion
    } catch (error) {
      setFeedback("Error deleting assignment. Please try again.");
      console.error("Error deleting assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (assignment) => (
    <Card
      key={assignment.id}
      sx={{
        width: 600,
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={assignment.attachmentUrl}
        alt="Attachment"
        sx={{ width: "100%", objectFit: "cover" }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          padding: 3,
          textAlign: "left",
        }}
      >
        <Typography gutterBottom variant="h4" component="div" sx={{ mb: 2 }}>
          <strong>Title:</strong> {assignment.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <p>
            <strong>Description:</strong> {assignment.description}
          </p>
          <p>
            <strong>Due Date:</strong> {assignment.dueDate}
          </p>
          <p>
            <strong>Class:</strong> {assignment.clazz}
          </p>
          <p>
            <strong>Created By:</strong> {assignment.createdBy}
          </p>
          <p>
            <strong>Attachment:</strong>{" "}
            <Link
              href={assignment.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Attachment
            </Link>
          </p>
        </Typography>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateAssignment(assignment)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteAssignment(assignment.id)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              navigate("/viewsubmission", {
                state: { assignmentId: assignment.id },
              })
            }
          >
            View Submission
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container">
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
          backgroundColor: "dodgerblue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        LOGOUT
      </button>
      <h1 className="header">Teacher Interface</h1>
      <button
        onClick={() => {
          setFeedback("");
          setViewSection("addAssignment");
        }}
        style={{
          marginRight: "10px",
          padding: "10px 20px",
          backgroundColor: "dodgerblue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Assignment
      </button>
      <button
        onClick={fetchAssignments}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "dodgerblue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        View Assignments
      </button>
      <button
        onClick={navigate("/myassignments")}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "dodgerblue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Assignments/Submissions
      </button>

      {viewSection === "addAssignment" && (
        <form onSubmit={handleSubmit} className="assignment-form">
          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date:</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Attachment URL:</label>
            <input
              type="url"
              className="form-control"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Class:</label>
            <select
              className="form-select"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              required
            >
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}

      {viewSection === "updateAssignment" && currentAssignment && (
        <form onSubmit={handleUpdateSubmit} className="assignment-form">
          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date:</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Attachment URL:</label>
            <input
              type="url"
              className="form-control"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Class:</label>
            <select
              className="form-select"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              required
            >
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      )}

      {viewSection === "viewAssignments" && (
        <div className="assignments-list">{assignments.map(renderCard)}</div>
      )}
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}

export default TeacherPage;
