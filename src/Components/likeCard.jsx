import { useEffect, useState } from "react"; // ייבוא hooks של React
import cardsService from "../Services/cardsService"; // ייבוא שירות הכרטיסים
import { useCards } from "../hooks/useCards"; // ייבוא hook לניהול כרטיסים
import { useAuth } from "../context/auth.context"; // ייבוא hook לניהול אוטנטיקציה
import ErrorMessage from "./Message/errorMsg"; // ייבוא רכיב הודעת שגיאה

function LikeCard({
  id,
  isLiked,
  onLikeUpdate = () => {}, // פונקציה לעדכון לייקים
  onRemoveFavorite = () => {}, // פונקציה להסרת כרטיס מהמועדפים
}) {
  const { cards, setCards } = useCards(); // שימוש ב-hook לקבלת כרטיסים
  const { user } = useAuth(); // קבלת מידע על המשתמש המחובר
  const [liked, setLiked] = useState(isLiked); // מצב לייק הכרטיס
  const [likeCount, setLikeCount] = useState(0); // ספירת הלייקים
  const [error, setError] = useState(null); // מצב לשגיאות

  // טעינת כמות הלייקים מהכרטיס הנוכחי
  useEffect(() => {
    if (cards.length > 0 && user) {
      const currentCard = cards.find((card) => card._id === id); // חיפוש הכרטיס הנוכחי
      if (currentCard) {
        setLikeCount(currentCard.likes.length); // עדכון ספירת הלייקים
        setLiked(currentCard.likes.includes(user._id)); // עדכון מצב הלייק
      }
    }
  }, [cards, user, id]); // תלות: cards, user, id

  const handleLikeClick = async () => {
    try {
      const { data } = await cardsService.likeCard(id); // שליחת בקשה ללייק
      if (data) {
        setCards((prevCards) =>
          prevCards.map(
            (card) => (card._id === id ? { ...card, likes: data.likes } : card) // עדכון רשימת הלייקים בכרטיס
          )
        );
        setLikeCount(data.likes.length); // עדכון ספירת הלייקים
        const newLikeState = data.likes.includes(user._id); // בדיקת מצב הלייק החדש
        setLiked(newLikeState); // עדכון מצב הלייק
        if (!newLikeState) {
          onRemoveFavorite(id); // הסרת הכרטיס מהמועדפים אם הלייק הוסר
        }
      }
      onLikeUpdate(); // עדכון כללי של הלייקים
    } catch (err) {
      setError(
        err.response
          ? `Error ${err.response.status}: ${
              err.response.data.message || "Server error"
            }`
          : "Network error or something went wrong" // הודעת שגיאה אם יש בעיה ברשת
      );
    }
  };

  // אם יש שגיאה, הצג הודעת שגיאה
  if (error) {
    return <ErrorMessage message={error} />; // הצגת הודעת שגיאה
  }

  return (
    <div>
      <span onClick={handleLikeClick}>
        {liked ? ( // תצוגת הלב בהתאם למצב הלייק
          <i className="bi bi-heart-fill text-danger"></i>
        ) : (
          <i className="bi bi-heart text-danger"></i>
        )}
      </span>
      <p>LIKE: {likeCount}</p> {/* הצגת ספירת הלייקים */}
    </div>
  );
}

export default LikeCard; // ייצוא רכיב LikeCard
