import React, { useEffect } from "react"; // ייבוא React וההוק useEffect
import { useMyCards } from "../hooks/useMyCards"; // ייבוא ההוק לניהול כרטיסים אישיים
import { useNavigate } from "react-router-dom"; // ייבוא ההוק לניווט
import Card from "../Components/Common/card"; // ייבוא רכיב כרטיס
import { useParams } from "react-router-dom"; // ייבוא ההוק לקבלת פרמטרים מהכתובת
import cardsService from "../Services/cardsService"; // ייבוא שירות כרטיסים
import ErrorMessage from "../Components/Message/errorMsg"; // ייבוא רכיב הודעת שגיאה
import LoadingMessage from "../Components/Message/loadingMsg"; // ייבוא רכיב הודעת טעינה
import CardsPageStyle from "../Components/Common/cardsPageStyle"; // ייבוא סגנון לדף כרטיסים
import ResponsiveCard from "./../Components/Common/responiveCard"; // ייבוא רכיב כרטיס מותאם
import PageHeaders from "../Components/Common/pageHeaders"; // ייבוא רכיב כותרות
import Logo from "../Components/logo"; // ייבוא רכיב הלוגו
import { toast } from "react-toastify";

function MyCards() {
  const { id } = useParams(); // קבלת ה-ID מהפרמטרים של הכתובת
  const { myCards, setMyCards, error, loading, setError } = useMyCards(id); // שימוש בהוק לניהול כרטיסים
  const navigate = useNavigate(); // הפניית ההוק לניווט

  // פונקציה להעברת ניווט לדף הכרטיס הספציפי
  const goToCard = (cardId) => {
    navigate(`/cards/${cardId}`);
  };

  // פונקציה להעברת ניווט לדף עדכון הכרטיס
  const editCard = (cardId) => {
    navigate(`/my-cards/update/${cardId}`);
  };

  // פונקציה למחיקת כרטיס
  const deleteCard = async (id) => {
    try {
      await cardsService.deleteCard(id); // קריאה לשירות מחיקת כרטיס
      const { data } = await cardsService.getMyCards(); // קבלת הכרטיסים העדכניים לאחר המחיקה
      setMyCards(data); // עדכון הסטייט של כרטיסים אישיים
      toast.success("The card has been successfully deleted");
    } catch (err) {
      setError(err); // הגדרת שגיאה במידה והייתה
    }
  };

  const handleLikeCard = (cardId) => {
    // לוגיקה עבור הלייק
  };

  const myCardsIds = myCards.map((card) => card._id); // המרת כרטיסים למערך של IDs

  // טיפול במצבים שונים
  if (error) {
    return <ErrorMessage message={error} />; // הצגת הודעת שגיאה
  }

  if (loading) {
    return <LoadingMessage message="your cards is loading" />; // הצגת הודעת טעינה
  }

  if (myCards.length === 0 && !loading) {
    return <div className="container">You have not created a card yet</div>; // הצגת הודעה אם אין כרטיסים
  }

  // החזרת הרכיב עם רשימת הכרטיסים
  return (
    <div className="container-fluid">
      <div className="row">
        <PageHeaders
          title={
            <>
              My-cards <Logo />
            </>
          }
        />
        <CardsPageStyle>
          {myCards.map(
            (
              card // מפה על הכרטיסים
            ) => (
              <ResponsiveCard key={card._id}>
                <Card
                  _id={card._id}
                  imageUrl={card.image.url}
                  imageAlt={card.image.alt}
                  title={card.title}
                  description={card.description}
                  phone={card.phone}
                  onClickCard={() => goToCard(card._id)} // פונקציה עבור לחיצה על הכרטיס
                  onClickUpdate={() => editCard(card._id)} // פונקציה עבור לחיצה על עדכון
                  isMyCards={myCardsIds.includes(card._id)} // בדיקת אם הכרטיס הוא אחד מהכרטיסים שלי
                  onClickDelete={() => deleteCard(card._id)} // פונקציה עבור מחיקת הכרטיס
                  likes={card.likes}
                  onClickLike={() => handleLikeCard(card._id)} // פונקציה עבור לחיצה על לייק
                />
              </ResponsiveCard>
            )
          )}
        </CardsPageStyle>
      </div>
    </div>
  );
}

export default MyCards; // ייצוא רכיב MyCards
