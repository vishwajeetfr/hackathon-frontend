import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

function CreateSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assignmentId } = location.state || {};
  const [submissionText, setSubmissionText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmission = async () => {
    const submittedBy = localStorage.getItem("username");
    const token = localStorage.getItem("jwtToken");

    const submissionData = {
      assignmentId: assignmentId,
      submissionText: submissionText,
      attachmentUrl: attachmentUrl,
      submittedBy: submittedBy,
      hasGraded: "SUBMITTED",
    };

    try {
      await axios.post("http://localhost:8080/submissions", submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/student"); // Adjust this path to where you want to navigate after submission
    } catch (error) {
      console.error("Error creating submission:", error);
      setErrorMessage("Failed to submit. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Create Submission
      </Typography>
      {errorMessage && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <TextField
        label="Submission Text"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={submissionText}
        onChange={(e) => setSubmissionText(e.target.value)}
        sx={{ mb: 3 }}
      />
      <TextField
        label="Attachment URL"
        variant="outlined"
        fullWidth
        value={attachmentUrl}
        onChange={(e) => setAttachmentUrl(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmission}
        sx={{ width: "100%", padding: "10px" }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default CreateSubmission;
