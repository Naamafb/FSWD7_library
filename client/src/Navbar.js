import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const username = JSON.parse(localStorage.getItem("currentUser")).username;
  const handleLogout =()=> {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("myBooksList");
    localStorage.removeItem("myWishList");
    localStorage.removeItem("myReadingList");
    localStorage.removeItem("myMessagesList");
    localStorage.removeItem("myFilterBooksList");
    localStorage.removeItem("myCategoriesList");


    for (let key in localStorage) {
      if (key.startsWith('readerForVolume')) {
        localStorage.removeItem(key);
      }
    }
  };
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to="/login" className={styles.link} onClick={handleLogout}>
          Logout
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/info`} className={styles.link}>
          Info
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/findBook`} className={styles.link}>
          Find the book
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/orderBasket`} className={styles.link}>
        Order basket
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/addNewBook`} className={styles.link}>
        Add New Book
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/myBooks`} className={styles.link}>
        My books
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/messages`} className={styles.link}>
        Messages
        </NavLink>
        <br />
      </nav>
      <Outlet />
    </>
  );
}
export default Navbar;
