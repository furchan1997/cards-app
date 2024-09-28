import { useAuth } from "../../context/auth.context"; // ייבוא הוק לניהול מצב האותנטיקציה
import { Navigate } from "react-router-dom"; // ייבוא הרכיב Navigate לשימוש בניתוב

const ProtectedRoute = ({ children, onlyBiz = false }) => {
  const { user } = useAuth(); // קבלת פרטי המשתמש מההוק

  // בדיקה אם המשתמש לא מחובר או אם יש צורך לבדוק אם הוא עסקי
  if (!user || (onlyBiz && !user.isBusiness)) {
    return <Navigate to="/sign-in" />; // אם לא, מנווטים לעמוד הכניסה
  }

  return children; // אם הכל בסדר, מציגים את הרכיבים הילדים
};

export default ProtectedRoute;
