import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";

function Login({ setUsername }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  if (localStorage.getItem("currentUser")) {
    localStorage.clear();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      return;
    }

    const url = "http://localhost:3000/login";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else
          //if (response.status === 401) {
          throw "Wrong username or password";
        // }
      })
      .then((user) => {
        console.log(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setUsername(name);
        console.log(user);
        navigate(`/users/${name}/info`);
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };

  return (
    <section className={styles.section}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h5>Library login</h5>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        {/* <button type="submit" className={styles.btn}>
          LOGIN
        </button> */}
        {/* <Link className={styles["btn-link"]} to="/register">
          REGISTER
        </Link> */}
        <br></br>
        <Button type="submit" fullWidth variant="contained" color="primary">
        LOGIN
          </Button>
          <br></br>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register">Already have not an account? REGISTER</Link>
            </Grid>
          </Grid>
      </form>
    </section>
  );
}

export default Login;