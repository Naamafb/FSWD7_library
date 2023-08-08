import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";
import Info from "./libraryPages/info";
import ContactTheManager from "./libraryPages/contactTheManager";
import FindBook from "./libraryPages/findBook";
import MyBooks from "./libraryPages/myBooks";
import OrderBasket from "./libraryPages/orderBasket";
import AddNewBook from "./libraryPages/addNewBook";
import Messages from "./libraryPages/messages";

//import Error from "/pages/Error";
import Register from "./Register";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setUsername(JSON.parse(user).username);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="login" element={<Login setUsername={setUsername} />} />
          <Route
            path="register"
            element={<Register setUsername={setUsername} />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            <Route
              path={`/users/${username}/info`}
              element={
                <ProtectedRoute>
                  <Info />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/users/${username}/findBook`}
              element={
                <ProtectedRoute>
                  <FindBook />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/users/${username}/orderBasket`}
              element={
                <ProtectedRoute>
                  <OrderBasket />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/users/${username}/addNewBook`}
              element={
                <ProtectedRoute>
                  <AddNewBook />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/users/${username}/myBooks`}
              element={
                <ProtectedRoute>
                  <MyBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/users/${username}/messages`}
              element={
                <ProtectedRoute>
                  <Messages/>
                </ProtectedRoute>
              }
            />
            {/* <Route path="*" element={<Error />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;