import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [noOfAssignments, setNoOfAssignments] = useState(0);
  const [submissionsCount, setSubmissionsCount] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await axios.get(
          `http://localhost:8080/assignments/teacher/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const assignmentsData = response.data;
        setAssignments(assignmentsData);
        setNoOfAssignments(assignmentsData.length);

        // Fetch the number of submissions for each assignment
        const submissionsData = {};
        for (const assignment of assignmentsData) {
          const submissionsResponse = await axios.get(
            `http://localhost:8080/submissions/assignment/${assignment.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          submissionsData[assignment.id] = submissionsResponse.data.length;
        }
        setSubmissionsCount(submissionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAssignments();
  }, []);

  const data = {
    labels: assignments.map((assignment) => assignment.title),
    datasets: [
      {
        label: "Number of Submissions",
        data: assignments.map(
          (assignment) => submissionsCount[assignment.id] || 0
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Assignments and Submissions",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
      <h1>Teacher Assignments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Number of Assignments: {noOfAssignments}</p>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;
