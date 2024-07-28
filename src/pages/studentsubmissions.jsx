import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Link } from "@mui/material";

function StudentSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(
          `http://localhost:8080/submissions/student/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmissions(response.data);
      } catch (error) {
        setError("Error fetching submissions. Please try again.");
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

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
        <Typography gutterBottom variant="h4" component="div" sx={{ mb: 2 }}>
          <strong>Assignment Title:</strong> {submission.assignment.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <p>
            <strong>Assignment Description:</strong>{" "}
            {submission.assignment.description}
          </p>
          <p>
            <strong>Due Date:</strong> {submission.assignment.dueDate}
          </p>
          <p>
            <strong>Class:</strong> {submission.assignment.clazz}
          </p>
          <p>
            <strong>Submitted By:</strong> {submission.student.username}
          </p>
          <p>
            <strong>Submission Text:</strong> {submission.submissionText}
          </p>
          <p>
            <strong>Submission Date:</strong> {submission.submissionDate}
          </p>
          <p>
            <strong>Graded Status:</strong> {submission.hasGraded}
          </p>
          <p>
            <strong>Assignment Attachment:</strong>{" "}
            <Link
              href={submission.assignment.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Attachment
            </Link>
          </p>
          <p>
            <strong>Submission Attachment:</strong>{" "}
            <Link
              href={submission.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Submission
            </Link>
          </p>
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div className="container">
      <h2>Student Submissions</h2>
      {submissions.map((submission) => renderCard(submission))}
    </div>
  );
}

export default StudentSubmissions;
