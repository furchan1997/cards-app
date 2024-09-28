import { useAuth } from "../context/auth.context"; // משתמש בהקשר של משתמשים
import { useTheme } from "../context/theme.context"; // משתמש בהקשר של נושא
import Logo from "./logo"; // ייבוא רכיב הלוגו
import { useNavigate } from "react-router-dom"; // ייבוא hook לניווט

function Footer() {
  const navigate = useNavigate(); // hook לניווט בין דפים
  const { user } = useAuth(); // השגת פרטי המשתמש
  const pointer = { cursor: "pointer" }; // סטייל עבור סמן העכבר
  const column = "d-flex flex-column-reverse"; // מחלקת CSS לעיצוב עמודה
  const { styles } = useTheme(); // השגת סגנונות מהקשר הנושא

  // פונקציה שמחזירה את הלינקים המתאימים בהתאם למשתמש
  const renderLinks = () => {
    const links = [
      {
        label: "About", // שם הלינק
        icon: "bi bi-info-circle", // אייקון הלינק
        path: "/about", // נתיב הלינק
      },
    ];

    // משתמש מחובר שאינו עסקי
    if (user && !user.isBusiness) {
      links.push({
        label: "Favorites", // הוספת לינק למועדפים
        icon: "bi bi-heart-fill text-danger", // אייקון הלינק
        path: "/Favorits-cards", // נתיב הלינק
      });
    }
    // משתמש עסקי
    if (user?.isBusiness) {
      // שימוש באופציונל צ'יינינג כדי לבדוק אם המשתמש עסקי
      links.push(
        {
          label: "Favorites",
          icon: "bi bi-heart-fill text-danger",
          path: "/Favorits-cards",
        },
        {
          label: "My cards",
          icon: "bi bi-person-vcard-fill",
          path: "/my-cards",
        }
      );
    }

    // החזרת המערך הסופי
    return links;
  };

  // כאן הקוד שירנדר את ה- UI
  return (
    <footer
      className={`container-fluid text-center fixed-bottom pb-2 w-100 d-flex ${styles.bodyClass}`} // footer רספונסיבי עם עיצוב גמיש
    >
      <div className="d-flex w-50 m-auto">
        <Logo />
        <span className="mx-2">&copy;</span>
        <span>{new Date().getFullYear()}</span>
      </div>

      <div className="container-fluid d-flex justify-content-evenly">
        {renderLinks().map(({ label, icon, path }) => (
          <div
            key={path} // קביעת מזהה ייחודי לכל לינק
            onClick={() => navigate(path)} // פונקציית ניווט
            className={column} // עיצוב בעמודה
            style={pointer} // סטייל לסמן עכבר
          >
            {label} <i className={icon}></i>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer; // ייצוא רכיב
