import { useEffect, useState } from "react";
import { useAuth } from "../context/auth.context";
import { useCards } from "../hooks/useCards";
import Card from "../Components/Common/card";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../Components/Message/errorMsg";
import LoadingMessage from "../Components/Message/loadingMsg";
import CardsPageStyle from "../Components/Common/cardsPageStyle";
import ResponsiveCard from "../Components/Common/responiveCard";
import PageHeaders from "../Components/Common/pageHeaders";
import Logo from "../Components/logo";

function FavoriteCards() {
  const { user } = useAuth(); // קבלת פרטי המשתמש מהקשר של האימות
  const { cards, error, loading } = useCards(); // קבלת כרטיסים, שגיאות וסטטוס טעינה מההוקס של הכרטיסים
  const [favotites, setFavorites] = useState([]); // מצב לניהול הכרטיסים המועדפים
  const navigate = useNavigate(); // ייצור פונקציית ניווט

  // פונקציה לניווט לדף הכרטיס הספציפי
  const goToCard = (cardId) => {
    navigate(`/cards/${cardId}`); // ניווט לדף הכרטיס
  };

  // אפקט המופעל בכל פעם שמשתנים הכרטיסים או המשתמש
  useEffect(() => {
    const likedCards = cards.filter((card) => card.likes.includes(user._id)); // סינון הכרטיסים המועדפים על פי מזהה המשתמש
    setFavorites(likedCards); // עדכון מצב הכרטיסים המועדפים
  }, [cards, user]);

  // פונקציה להסרת כרטיס מהמועדפים
  const removeCard = (cardId) => {
    setFavorites((prevFavorites) => {
      return prevFavorites.filter((card) => card._id !== cardId); // סינון הכרטיסים לפי מזהה הכרטיס שהוסר
    });
  };

  // פונקציה לוגיקה עבור הלייק
  const handleLikeCard = (cardId) => {};

  // אם קיימת שגיאה, מחזירים הודעת שגיאה
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // אם הטעינה עדיין מתבצעת, מחזירים הודעת טעינה
  if (loading) {
    return <LoadingMessage message="favorites cards loading" />;
  }

  // אם אין כרטיסים מועדפים
  if (favotites.length === 0 && !loading) {
    return <div className="container">You haven't liked any card yet</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <PageHeaders
          title={
            <>
              Favorites cards <Logo />
            </>
          }
        />
        <CardsPageStyle>
          {favotites.map((card) => (
            <ResponsiveCard key={card._id}>
              <Card
                _id={card._id}
                imageUrl={card.image.url}
                imageAlt={card.image.alt}
                title={card.title}
                description={card.description}
                onClickCard={() => goToCard(card._id)}
                isMyCards={false}
                onRemoveFavorite={removeCard}
                onClickLike={() => handleLikeCard(card._id)}
              />
            </ResponsiveCard>
          ))}
        </CardsPageStyle>
      </div>
    </div>
  );
}

export default FavoriteCards;
