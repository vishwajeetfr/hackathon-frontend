import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

function StudentPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [viewAssignments, setViewAssignments] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("class");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const fetchAssignments = async () => {
    const classType = localStorage.getItem("class");
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/assignments/class/${classType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data); // Log API response
      setAssignments(response.data);
      setViewAssignments(true);
    } catch (error) {
      console.error("Error fetching assignments:", error);
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
      {assignment.attachmentUrl && (
        <CardMedia
          component="img"
          height="300"
          image={assignment.attachmentUrl}
          alt="Attachment"
          sx={{ width: "100%", objectFit: "cover" }}
        />
      )}
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
            <strong>Created By:</strong> {assignment.createdBy.username}
          </p>
        </Typography>
        <div style={{ display: "flex", gap: "10px" }}>
          {assignment.attachmentUrl && (
            <Button
              variant="contained"
              color="primary"
              href={assignment.attachmentUrl}
              target="_blank"
            >
              View Attachment
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              navigate("/createsubmission", {
                state: { assignmentId: assignment.id },
              })
            }
          >
            Create Submission
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h1>Student Interface</h1>
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
      <button
        onClick={fetchAssignments}
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
        View Assignments
      </button>

      {viewAssignments && (
        <div style={{ marginTop: "20px" }}>
          {assignments.length > 0 ? (
            assignments.map((assignment) =>
              assignment && typeof assignment === "object" ? (
                renderCard(assignment)
              ) : (
                <Typography key={assignment.id} variant="body1" color="error">
                  Error rendering assignment data.
                </Typography>
              )
            )
          ) : (
            <Typography variant="body1" color="text.secondary">
              No assignments found.
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentPage;
