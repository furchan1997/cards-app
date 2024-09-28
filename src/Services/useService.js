// מייבאים את שירות ה-HTTP ואת פונקציית הגדרת הכותרות המשותפות
import httpService, { setDefaultCommonHeaders } from "./httpService";
// מייבאים את הפונקציה לפענוח JWT
import { jwtDecode } from "jwt-decode";

// מגדירים מפתח קבוע לאחסון הטוקן ב-localStorage
const TOKEN_KEY = "token";

// קוראים לפונקציה שמרעננת את הטוקן בהגדרת הכותרות המשותפות
refreshToken();

// פונקציה שמרעננת את הטוקן ומעדכנת את הכותרת "x-auth-token"
export function refreshToken() {
  // מעדכנים את הכותרות המשותפות עם הטוקן הנוכחי
  setDefaultCommonHeaders("x-auth-token", getJWT());
}

// פונקציה שמאחסנת טוקן ב-localStorage ומרעננת את הכותרת
export function setToken(token) {
  // מאחסנים את הטוקן ב-localStorage
  localStorage.setItem(TOKEN_KEY, token);
  // מרעננים את הכותרת לאחר שמירה
  refreshToken();
}

// פונקציה שמחזירה את הטוקן מה-localStorage
export function getJWT() {
  return localStorage.getItem(TOKEN_KEY);
}

// פונקציה ליצירת משתמש חדש בשרת
export function createUser(user) {
  // שולחים בקשה לשרת כדי ליצור משתמש חדש
  return httpService.post("/users", user);
}

// פונקציה להתחברות של משתמש עם פרטי הזיהוי
export async function login(credentials) {
  // שולחים בקשה להתחברות לשרת עם פרטי הזיהוי
  const response = await httpService.post("/users/login", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // מאחסנים את הטוקן שהתקבל מהשרת
  setToken(response.data);
  return response; // מחזירים את התגובה מהשרת
}

// פונקציה שמחזירה את המידע על המשתמש מהטוקן
export function getUser() {
  try {
    // מקבלים את הטוקן
    const token = getJWT();
    // מפענחים את המידע מהטוקן
    return jwtDecode(token);
  } catch {
    return null; // אם הפענוח נכשל, מחזירים null
  }
}

// פונקציה ליציאה של משתמש
export function logout() {
  return setToken(null); // מאחסנים null כטוקן
}

// פונקציה שמחזירה את המידע על המשתמש הנוכחי
export async function getMe() {
  const user = getUser(); // מקבלים את המידע על המשתמש הנוכחי
  return await httpService.get("/users/" + user._id); // שולחים בקשה לקבלת פרטי המשתמש
}

// אובייקט שמרכז את כל פעולות המשתמש
const userService = {
  createUser,
  login,
  getUser,
  logout,
  getMe,
  getJWT,
};

// מייצאים את אובייקט userService לשימוש בקבצים אחרים
export default userService;
