// ייבוא מודולים ורכיבים נחוצים
import { useCards } from "../hooks/useCards"; // חיבור להוק המנהל את הכרטיסים
import Card from "../Components/Common/card"; // רכיב כרטיסים להצגה
import { useNavigate } from "react-router-dom"; // חיבור לפונקציות ניווט
import PageHeaders from "../Components/Common/pageHeaders"; // רכיב להצגת כותרת ודסקריפשן של הדף
import Logo from "../Components/logo"; // רכיב הלוגו של האתר
import { useState, useEffect } from "react"; // ייבוא useState ו-useEffect מהספריה של React
import { ErrorMessage } from "../Components/Message/errorMsg"; // רכיב להצגת הודעות שגיאה
import LoadingMessage from "../Components/Message/loadingMsg"; // רכיב להצגת הודעות טעינה
import { useAuth } from "../context/auth.context"; // חיבור להקשר האותנטיקציה
import ResponsiveCard from "../Components/Common/responiveCard"; // רכיב כרטיסים רספונסיבי
import CardsPageStyle from "../Components/Common/cardsPageStyle"; // סטיילינג לעמוד כרטיסים

// רכיב Cards
function Cards({ searchResults }) {
  const navigate = useNavigate(); // הפונקציה שמבצעת ניווט
  const { cards, error, loading } = useCards(); // קבלת הכרטיסים, השגיאות והסטטוס של טעינה מההוק
  const [filteredCards, setFilteredCards] = useState(cards); // מצב לתוצאות חיפוש
  const { user } = useAuth(); // קבלת מידע על המשתמש הנוכחי מההקשר

  // עדכון רשימת הכרטיסים המוצגת לפי תוצאות החיפוש
  useEffect(() => {
    setFilteredCards(searchResults.length > 0 ? searchResults : cards);
  }, [searchResults, cards]);

  // פונקציה לניווט לעמוד כרטיס ספציפי
  const goToCard = (cardId) => {
    navigate(`/cards/${cardId}`); // ניווט לעמוד הכרטיס עם ה-ID המתאים
  };

  // פונקציה לטיפול בלייקים על כרטיסים
  const handleLikeCard = (cardId) => {
    // כאן תוכל להוסיף את הלוגיקה שלך ללייקים
  };

  // טיפול בשגיאות: אם יש שגיאה, הצג הודעת שגיאה
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // טיפול בטעינה: אם הכרטיסים נטענים, הצג הודעת טעינה
  if (loading) {
    return <LoadingMessage message="card loading" />;
  }

  // אם המשתמש לא מחובר
  if (!user) {
    return (
      <div className="container-fluid">
        <div className="row">
          <PageHeaders
            title={<>Welcome to {<Logo />}</>}
            description="Welcome to the best business cards site"
          />
          <CardsPageStyle>
            {filteredCards.map((card) => (
              <ResponsiveCard key={card._id}>
                <Card
                  _id={card._id}
                  imageUrl={card.image.url}
                  imageAlt={card.image.alt}
                  title={card.title}
                  description={card.description}
                  onClickCard={() => goToCard(card._id)}
                />
              </ResponsiveCard>
            ))}
          </CardsPageStyle>
        </div>
      </div>
    );
  }

  // אם המשתמש מחובר
  if (user) {
    return (
      <div className="container-fluid">
        <div className="row">
          <PageHeaders
            title={<>Welcome to {<Logo />}</>}
            description="Welcome to the best business cards site"
          />
          <CardsPageStyle>
            {filteredCards.map((card) => (
              <ResponsiveCard key={card._id}>
                <Card
                  _id={card._id}
                  imageUrl={card.image.url}
                  imageAlt={card.image.alt}
                  title={card.title}
                  description={card.description}
                  onClickCard={() => goToCard(card._id)}
                  isMyCards={false}
                  onClickLike={() => handleLikeCard(card._id)}
                />
              </ResponsiveCard>
            ))}
          </CardsPageStyle>
        </div>
      </div>
    );
  }
}

// ייצוא הרכיב
export default Cards;
