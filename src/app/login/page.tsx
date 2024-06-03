"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { config } from "process";

const Login: React.FC = () => {
  const [username, setUsername] = useState("user1@example.com");
  const [password, setPassword] = useState("password123");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const headers = {
    "Content-Type": "application/json",
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email: username, password },
        {
          headers: headers,
        }
      );
      if (response.status === 201) {
        setMessage("Login successful");
        const token = response.data.access_token;
        localStorage.setItem("token", token);

        router.push("/private");
      }
    } catch (error) {
      setMessage("Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        {message && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Login;
