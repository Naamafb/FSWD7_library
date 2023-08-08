import styles from "./Info.module.css";

function Info() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className={styles["user-card"]}>
      <h1>{user.name}</h1>
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
            <td>Website</td>
            <td>{user.website}</td>
          </tr>
          <tr>
            <td>Rank</td>
            <td>{user.rank}</td>
          </tr>
          <tr>
            <td>api key</td>
            <td>{user.api_key}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Info;
