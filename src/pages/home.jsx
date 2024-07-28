import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_TEACHER");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const payload = {
      userName: username,
      password: password,
      role: role,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Store the JWT token in localStorage
        localStorage.setItem("jwtToken", data.jwtToken);

        // Fetch additional user info
        const userInfoResponse = await fetch(
          `http://localhost:8080/users/username/${data.userName}`,
          {
            headers: {
              Authorization: `Bearer ${data.jwtToken}`,
            },
          }
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          console.log("User info fetched:", userInfo);

          // Store user info in localStorage
          localStorage.setItem("userId", userInfo.id);
          localStorage.setItem("username", userInfo.username);
          localStorage.setItem("role", userInfo.role);

          if (userInfo.role === "STUDENT") {
            localStorage.setItem("class", userInfo.classId.name);
          }
          // Navigate based on the role/
          if (userInfo.role === "TEACHER") {
            navigate("/faculty");
          } else if (userInfo.role === "STUDENT") {
            navigate("/student");
          }
        } else {
          console.error(
            "Failed to fetch user info:",
            userInfoResponse.statusText
          );
        }
      } else {
        setFeedback("INVALID CREDENTIALS");
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      setFeedback("INVALID CREDENTIALS");
      console.error("An error occurred:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="ROLE_TEACHER">TEACHER</option>
          <option value="ROLE_STUDENT">STUDENT</option>
        </select>
      </div>
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>

      {feedback && <p>{feedback}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    margin: "10px 0",
  },
  input: {
    padding: "10px",
    width: "220px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  select: {
    padding: "10px",
    width: "120px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default LoginPage;
