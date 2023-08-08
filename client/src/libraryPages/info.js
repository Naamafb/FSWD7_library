import { useState, useEffect } from "react";
import styles from "./Info.module.css";

function Info() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [isEdit, setIsEdit] = useState(0);

  const editInfo = async () => {
    let fisrtName = document.getElementById("updatedFirstName").value;
    let lastName = document.getElementById("updatedLastName").value;
    let userName = document.getElementById("updatedUserName").value;
    let email = document.getElementById("updatedEmail").value;
    let phone = document.getElementById("updatedPhone").value;
    let address = document.getElementById("updatedAddress").value;
    let age = document.getElementById("updatedAge").value;

    if (!fisrtName || !lastName || !userName || !email || !phone || !address || !age) {
      alert("One or more fields are missing!");
      return;
    }
    console.log(user.id);
    const userInfo = {
      id: user.id,
      first_name: fisrtName,
      last_name: lastName,
      username: userName,
      phone: phone,
      address: address,
      email: email,
      age: age
    };

    console.log(userInfo);
    const url = `http://localhost:3000/Info/${user.id}`;
    const requestUpdateUserInfo = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    };

    await fetch(url, requestUpdateUserInfo)
      .then((res) => {
        console.log(userInfo);
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
        setUser(userInfo);
        setIsEdit(0);
      })
      .catch((error) => {
        console.log(error);
      });

  };

  return (
    <div>
      {isEdit === 0 ? (
        <div className={styles["user-card"]}>
          <h1>{user.first_name} {user.last_name}</h1>
          <table>
            <tbody>
              <tr>
                <td>Username</td>
                <td>{user.username}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{user.phone}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{user.address}</td>
              </tr>
              <tr>
                <td>Age</td>
                <td>{user.age}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => setIsEdit(1)}>Edit</button>
        </div>
      ) : (
        <div className={styles["user-card"]}>
        <table>
          <tr>
          <td>Fisrt name</td>
          <td><input id="updatedFirstName" defaultValue={user.first_name} /></td>
          </tr>
          <tr>
          <td>Last name</td>
          <td><input id="updatedLastName" defaultValue={user.last_name} /></td>
          </tr>
          <tr>
          <td>Username</td>
          <td><input id="updatedUserName" defaultValue={user.username} /></td>
          </tr>
          <tr>
          <td>Email</td>
          <td><input id="updatedEmail" defaultValue={user.email} /></td>
          </tr>
          <tr>
          <td>Phone</td>
          <td><input id="updatedPhone" defaultValue={user.phone} /></td>
          </tr>
          <tr>
          <td>Address</td>
          <td><input id="updatedAddress" defaultValue={user.address} /></td>
          </tr>
          <tr>
          <td>Age</td>
          <td><input id="updatedAge" defaultValue={user.age} /></td>
          </tr>
        </table>
        <button onClick={editInfo}>Save</button>
        </div>
      )}
    </div>
  );
}

export default Info;
