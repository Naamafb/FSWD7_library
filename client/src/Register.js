import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
// import styles from "./Login.module.css";
// import styles from "./Register.css"
import TextField from '@mui/material/TextField';
// import Button from "@mui/material/Button";
import { Button } from "@mui/material";

import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';


function Register() {

  const [user, setUser] = useState({ username: "", password: "", first_name: "", last_name: "", email: "", phone: '', address: '', age: "" ,id:""}); // מערך שמכיל את המשתנים של השם והסיסמה

  const navigate = useNavigate();
  const [ageError, setAgeError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(inputCheck()){
    const url = "http://localhost:3000/register";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };

    fetch(url, requestOptions)
      .then((response) => {
        console.log('n');
        if (response.status === 200) {
          console.log(response);
          return response.json();
        } else
          // if (response.status === 409) {
          console.log(response);
        throw "Username or password already exists";
        //  }
      })
      .then((u) => {
        // console.log(u);
        // setUser({ ...user, id: u });
        // localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("reg ok ");
        // navigate(`/users/${user.username}/info`);
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
    }else{
      alert("try again, on of the fileds is not correct")
    }
  };

  const inputCheck=()=>{
    if(user.username===""){
      alert("the username is empty, try again");
      return false;
    }
    console.log(user.password.length);
    if(user.password.length<4||user.password.length>8){
      return false;
    }
    if(user.age< 16 || user.age > 120){
      return false;
    }
    console.log(user.phone.length);
    if(user.phone.length!=10){
      alert("users phone most be 10 numbers ")
      return false;
    }
    return true;
  }
  const handleAgeChange = (e) => {
    const ageValue = e.target.value;
    if (ageValue < 16 || ageValue > 120) {
      setAgeError("Age must be between 16 and 120");
    } else {
      setAgeError("");

    }
    setUser({ ...user, age: ageValue });

  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <br></br>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
              required
                label="Username"
                variant="outlined"
                fullWidth
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                inputProps={{ minLength: 2, maxLength: 8 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              required
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                inputProps={{ minLength: 4, maxLength: 8 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
              type="text"
                label="First Name"
                variant="outlined"
                fullWidth
                value={user.first_name}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                inputProps={{ minLength: 2, maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                            type="text"
                label="Last Name"
                variant="outlined"
                fullWidth
                value={user.last_name}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                inputProps={{ minLength: 2, maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              required
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              required
                type="tel"
                label="Phone"
                variant="outlined"
                fullWidth
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                inputProps={{ length: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Address"
                variant="outlined"
                fullWidth
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                label="Age"
                variant="outlined"
                fullWidth
                value={user.age}
                onChange={handleAgeChange}
                error={ageError !== ""}
                helperText={ageError}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary">
            REGISTER
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login">Already have an account? Login</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );

  // return (
  //   <section className={styles.section}>
  //     <form className={styles.form} onSubmit={handleSubmit}>
  //       <h5>REGISTER</h5>
  //                  <Grid item xs={12}>
  //              <TextField
  //                label="Username"
  //                variant="outlined"
  //                fullWidth
  //                value={user.username}
  //                onChange={(e) => setUser({ ...user, username: e.target.value })}
  //              />
  //            </Grid>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="password"
  //           placeholder="Password"
  //           className={styles["form-input"]}
  //           id="password"
  //           value={user.password}
  //           onChange={(e) => setUser({ ...user, password: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="text"
  //           placeholder="first_name"
  //           className={styles["form-input"]}
  //           id="first_name"
  //           value={user.first_name}
  //           onChange={(e) => setUser({ ...user, first_name: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="text"
  //           placeholder="last_name"
  //           className={styles["form-input"]}
  //           id="last_name"
  //           value={user.last_name}
  //           onChange={(e) => setUser({ ...user, last_name: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="email"
  //           placeholder="email"
  //           className={styles["form-input"]}
  //           id="email"
  //           value={user.email}
  //           onChange={(e) => setUser({ ...user, email: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="phone"
  //           placeholder="phone"
  //           className={styles["form-input"]}
  //           id="phone"
  //           value={user.phone}
  //           onChange={(e) => setUser({ ...user, phone: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="text"
  //           placeholder="address"
  //           className={styles["form-input"]}
  //           id="address"
  //           value={user.address}
  //           onChange={(e) => setUser({ ...user, address: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <div className={styles["form-row"]}>
  //         <input
  //           type="number"
  //           placeholder="age"
  //           className={styles["form-input"]}
  //           id="age"
  //           value={user.age}
  //           onChange={(e) => setUser({ ...user, age: e.target.value })} // עדכון השדה של השם ב-user
  //         />
  //       </div>
  //       <Button type="submit" fullWidth variant="contained" color="primary">
  //           REGISTER
  //         </Button>
  //       {/* <button type="submit" className={styles.btn}>
  //         REGISTER
  //       </button> */}
  //                  <Grid item>
  //            <Link to="/login">Already have an account? Login</Link>
  //            </Grid>
  //     </form>
  //   </section>
  // );
}

export default Register;