import { createContext, useContext, useEffect, useState } from "react";

// יצירת הקשר (context) עבור נושא (Theme)
export const ThemeContext = createContext();

// הגדרת שם תצוגה למטרות דיבוג ב-React DevTools
ThemeContext.displayName = "Theme";

// רכיב ThemeProvider לניהול מצב הנושא של האפליקציה
export function ThemeProvider({ children }) {
  // מצב המייצג את הנושא הנוכחי, עם ערך ברירת מחדל מה-localStorage או "light"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("Theme") || "light"; // אתחול המצב מה-localStorage
  });

  // פונקציה לקבלת סגנון בהתאם לנושא הנוכחי
  const getStyle = (theme) => {
    if (theme === "dark") {
      return {
        bodyClass: "bg-light text-dark", // סגנון לגוף עבור נושא כהה
        navClass: "navbar-light bg-light", // סגנון לניהול עבור נושא כהה
        buttonClass: "btn btn-dark", // סגנון לכפתורים עבור נושא כהה
      };
    } else {
      return {
        bodyClass: "bg-dark text-light", // סגנון לגוף עבור נושא בהיר
        navClass: "navbar-dark bg-dark", // סגנון לניהול עבור נושא בהיר
        buttonClass: "btn btn-light", // סגנון לכפתורים עבור נושא בהיר
      };
    }
  };

  // פונקציה להחלפת הנושא בין בהיר לכהה
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light")); // שינוי הנושא הקודם
  };

  // שימוש ב-useEffect כדי לשמור את הנושא ב-localStorage בכל שינוי
  useEffect(() => {
    localStorage.setItem("Theme", theme); // שמירת הנושא הנוכחי ב-localStorage
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, styles: getStyle(theme) }} // ערכים המוצעים להקשר
    >
      {children} {/* רכיבי הילדים */}
    </ThemeContext.Provider>
  );
}

// פונקציה להחזרת ההקשר של ThemeContext
export const useTheme = () => {
  return useContext(ThemeContext);
};
