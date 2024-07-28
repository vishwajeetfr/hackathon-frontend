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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Link,
  Alert,
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
        onClick={() => navigate("/myassignments")}
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
        Assigments/Submissions
      </button>

      {viewSection === "addAssignment" && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 3,
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Add New Assignment
          </Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />
          <FormControl fullWidth required>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              customInput={<TextField label="Due Date" fullWidth required />}
            />
          </FormControl>
          <TextField
            label="Attachment URL"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel id="class-type-label"></InputLabel>
            <Select
              labelId="class-type-label"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="11th">11th</MenuItem>
              <MenuItem value="12th">12th</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
          {feedback && (
            <Alert
              severity={feedback.includes("successfully") ? "success" : "error"}
            >
              {feedback}
            </Alert>
          )}
        </Box>
      )}

      {viewSection === "updateAssignment" && (
        <Box
          component="form"
          onSubmit={handleUpdateSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 3,
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Update Assignment
          </Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />
          <FormControl fullWidth required>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              customInput={<TextField label="Due Date" fullWidth required />}
            />
          </FormControl>
          <TextField
            label="Attachment URL"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel id="class-type-label">Class</InputLabel>
            <Select
              labelId="class-type-label"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="11th">11th</MenuItem>
              <MenuItem value="12th">12th</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
          {feedback && (
            <Alert
              severity={feedback.includes("successfully") ? "success" : "error"}
            >
              {feedback}
            </Alert>
          )}
        </Box>
      )}

      {viewSection === "viewAssignments" && (
        <div>
          <h2>Assignments</h2>
          {assignments.map((assignment) => renderCard(assignment))}
        </div>
      )}
    </div>
  );
}

export default TeacherPage;
