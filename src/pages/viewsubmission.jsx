import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";

function ViewSubmissions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assignmentId } = location.state || {};
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");

  const fetchSubmissions = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/submissions/assignment/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data); // Log API response
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    const submittedBy = localStorage.getItem("username");
    const token = localStorage.getItem("jwtToken");

    const gradeData = {
      submittedBy: submittedBy,
      hasGraded: grade,
    };

    try {
      await axios.put(
        `http://localhost:8080/submissions/grade/${submissionId}`,
        gradeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the submissions list after grading
      fetchSubmissions();
      setSelectedSubmission(null); // Close the grading input
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const renderCard = (submission) => (
    <Card
      key={submission.id}
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
        <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
          <strong>Student:</strong> {submission.student.username}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <p>
            <strong>Submission Text:</strong> {submission.submissionText}
          </p>
          <p>
            <strong>Submission Date:</strong> {submission.submissionDate}
          </p>
          <p>
            <strong>Grade:</strong> {submission.hasGraded}
          </p>
          {submission.attachmentUrl && (
            <Button
              variant="contained"
              color="primary"
              href={submission.attachmentUrl}
              target="_blank"
              sx={{ mt: 2 }}
            >
              View Attachment
            </Button>
          )}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setSelectedSubmission(submission.id)}
          sx={{ mt: 2 }}
        >
          Grade Submission
        </Button>
        {selectedSubmission === submission.id && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <TextField
              label="Grade"
              variant="outlined"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGradeSubmission(submission.id)}
            >
              Submit Grade
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <button
        onClick={() => navigate("/teacher")}
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
        BACK
      </button>
      <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          View Submissions
        </Typography>
        {submissions.length > 0 ? (
          submissions.map((submission) =>
            submission && typeof submission === "object" ? (
              renderCard(submission)
            ) : (
              <Typography key={submission.id} variant="body1" color="error">
                Error rendering submission data.
              </Typography>
            )
          )
        ) : (
          <Typography variant="body1" color="text.secondary">
            No submissions found.
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default ViewSubmissions;
