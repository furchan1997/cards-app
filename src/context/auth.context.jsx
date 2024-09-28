import { createContext, useContext, useEffect, useState } from "react";
import userService, { getJWT } from "../Services/useService";

// פונקציה להשלכת שגיאה כאשר authContext לא בשימוש כראוי
const fn_error_context_must_be_used = () => {
  throw new Error("must use authContext provider for consumer to work");
};

// יצירת authContext עם ערכים ברירת מחדל
export const authContext = createContext({
  user: null, // מייצג את המשתמש המאומת הנוכחי
  login: fn_error_context_must_be_used, // פונקציה עבור כניסת משתמש
  logout: fn_error_context_must_be_used, // פונקציה עבור יציאת משתמש
  signUp: fn_error_context_must_be_used, // פונקציה לרישום משתמש חדש
});

authContext.displayName = "Auth";

// רכיב AuthProvider לניהול מצב האימות
export function AuthProvider({ children }) {
  // מצב שמחזיק את המשתמש הנוכחי ואת המידע המפורט על המשתמש
  const [user, setUser] = useState(userService.getUser()); // אתחול מצב המשתמש מהשירות
  const [myUser, setMyUser] = useState(); // מצב למידע נוסף על המשתמש

  // פונקציה לרענון מצב המשתמש על ידי קבלת המשתמש מהשירות
  const refreshUser = () => setUser(userService.getUser());

  // פונקציה אסינכרונית עבור כניסת משתמש ורענון המידע
  const login = async (credentials) => {
    const response = await userService.login(credentials); // כניסת משתמש
    await getMyUser(); // קבלת מידע נוסף על המשתמש
    refreshUser(); // רענון מצב המשתמש
    return response; // החזרת התגובה
  };

  // פונקציה אסינכרונית לקבלת המידע על המשתמש הנוכחי
  const getMyUser = async () => {
    const me = await userService.getMe(); // קבלת מידע על המשתמש
    setMyUser(me.data); // עדכון מצב myUser
  };

  // פונקציה אסינכרונית עבור יציאת משתמש
  const logout = async () => {
    userService.logout(); // יציאת משתמש
    setMyUser(null); // נקה את myUser לאחר לוגאוט
    refreshUser(); // רענון מצב המשתמש
  };

  // שימוש ב-useEffect כדי לבדוק האם יש משתמש ולהשיג את המידע שלו
  useEffect(() => {
    if (user) {
      getMyUser(); // קבלת מידע נוסף על המשתמש אם הוא קיים
    }
  }, [user]);

  return (
    <authContext.Provider
      value={{
        user, // המשתמש הנוכחי
        myUser, // המידע המפורט על המשתמש
        login, // פונקציה עבור כניסת משתמש
        logout, // פונקציה עבור יציאת משתמש
        signUp: userService.createUser, // פונקציה לרישום משתמש
      }}
    >
      {children} {/* רכיבי הילדים */}
    </authContext.Provider>
  );
}

// פונקציה להחזרת ההקשר של authContext
export function useAuth() {
  return useContext(authContext);
}
