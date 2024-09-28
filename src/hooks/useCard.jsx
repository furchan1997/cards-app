import { useEffect, useState } from "react";
import cardsService from "../Services/cardsService";

// פוקנציה מותאמת אישית useCard לקבלת כרטיס על פי מזהה
export const useCard = (id) => {
  // מצב המייצג את הכרטיס הנוכחי, מאוחסן ב-state
  const [card, setCard] = useState(null);
  // מצב המייצג שגיאות אם יש, מאוחסן ב-state
  const [error, setError] = useState(null);
  // מצב המייצג את מצב הטעינה של המידע
  const [loading, setLoading] = useState(true);

  // השפעה שתופסת את הכרטיס כאשר המזהה משתנה
  useEffect(() => {
    const getCard = async () => {
      try {
        // קריאה לשירות לקבלת הכרטיס
        const { data } = await cardsService.getCardId(id);
        setCard(data); // עדכון מצב הכרטיס ב-state
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

    getCard(); // קריאה לפונקציה
  }, [id]); // תפקוד מחדש כאשר ה-id משתנה

  // החזרת מצב הכרטיס, פונקציית עדכון הכרטיס, השגיאה ומצב הטעינה
  return { card, setCard, error, loading };
};
