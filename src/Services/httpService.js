// מייבאים את הגדרות הקונפיגורציה מהקובץ config.json
import config from "../config.json";

// מייבאים את ספריית Axios לניהול קריאות HTTP
import axios from "axios";

// קובעים את ה-URL הבסיסי עבור כל הקריאות ל-API מתוך קובץ הקונפיגורציה
axios.defaults.baseURL = config.apiUrl;

// פונקציה להגדרת כותרות משותפות ברירת מחדל עבור Axios
export function setDefaultCommonHeaders(headerName, value) {
  // מעדכנים את הכותרות המשותפות ב-Axios
  axios.defaults.headers.common[headerName] = value;
}

// אובייקט שמרכז את כל פעולות ה-HTTP שניתן לבצע בעזרת Axios
const httpService = {
  // פונקציית GET עבור קריאות HTTP
  get: axios.get,
  // פונקציית POST עבור שליחת נתונים לשרת
  post: axios.post,
  // פונקציית DELETE עבור מחיקת נתונים בשרת
  delete: axios.delete,
  // פונקציית PUT עבור עדכון נתונים קיימים בשרת
  put: axios.put,
  // פונקציית PATCH עבור עדכון חלקי של נתונים בשרת
  patch: axios.patch,
  // פונקציה שהגדרנו לשימוש בהגדרת כותרות משותפות
  setDefaultCommonHeaders,
};

// מייצאים את אובייקט httpService לשימוש בקבצים אחרים
export default httpService;
