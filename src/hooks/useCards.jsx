import { useEffect, useState } from "react";
import cardsService from "../Services/cardsService";

// פוקנציה מותאמת אישית useCards לקבלת רשימת כרטיסים
export const useCards = () => {
  // מצב המייצג את רשימת הכרטיסים, מאוחסן ב-state
  const [cards, setCards] = useState([]);
  // מצב המייצג שגיאות אם יש, מאוחסן ב-state
  const [error, setError] = useState(null);
  // מצב המייצג את מצב הטעינה של המידע
  const [loading, setLoading] = useState(true);

  // השפעה שתופסת את הכרטיסים כאשר הרכיב טוען
  useEffect(() => {
    const getCards = async () => {
      try {
        // קריאה לשירות לקבלת כל הכרטיסים
        const { data } = await cardsService.getAll();
        setCards(data); // עדכון מצב הכרטיסים ב-state
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

    getCards();
  }, []);

  // החזרת רשימת הכרטיסים, פונקציית עדכון הכרטיסים, השגיאה ומצב הטעינה
  return { cards, setCards, error, loading, setError };
};
