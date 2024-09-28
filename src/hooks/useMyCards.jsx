import { useEffect, useState } from "react";
import cardsService from "../Services/cardsService";

// פונקציה מותאמת אישית לטיפול בכרטיסי היוסר
export const useMyCards = () => {
  // מצב המייצג את הכרטיסים של המשתמש, מאוחסן ב-state
  const [myCards, setMyCards] = useState([]);
  // מצב המייצג שגיאות אם יש, מאוחסן ב-state
  const [error, setError] = useState(null);
  // מצב המייצג את מצב הטעינה של המידע
  const [loading, setLoading] = useState(true);

  // השפעה שתופסת את הכרטיסים של המשתמש כאשר הרכיב טוען
  useEffect(() => {
    const get_My_Cards = async () => {
      try {
        // קריאה לשירות לקבלת הכרטיסים של המשתמש הנוכחי
        const { data } = await cardsService.getMyCards();

        setMyCards(data); // עדכון מצב הכרטיסים של המשתמש ב-state
      } catch (err) {
        // בדוק אם יש תגובה מהשרת ואם יש סטטוס שגיאה
        if (err.response && err.response.status) {
          // עדכון מצב השגיאה עם הודעה מפורטת
          setError(
            `Error ${err.response.status}: ${
              err.response.data.message || "Server error"
            }`
          );
        } else {
          // במקרה של שגיאות רשת או אחרות
          setError("Network error or something went wrong");
        }
      } finally {
        // עדכון מצב הטעינה כאשר הסתיים ניסיון הקריאה
        setLoading(false);
      }
    };

    get_My_Cards();
  }, []);

  // החזרת הכרטיסים של המשתמש, פונקציית עדכון הכרטיסים, השגיאה ומצב הטעינה
  return { myCards, setMyCards, error, loading, setError };
};
