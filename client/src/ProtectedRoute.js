import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  if (!localStorage.getItem("currentUser")) {
    return <Navigate to="/login" />;
  }
  return children;
}
export default ProtectedRoute;
