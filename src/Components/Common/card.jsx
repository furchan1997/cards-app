import React from "react";
import LikeCard from "../likeCard"; // רכיב לייקים, לא ברור מה הוא עושה למי שלא מכיר
import { useAuth } from "../../context/auth.context"; // הקשר לאותנטיקציה
import { ImageStyle } from "./imageStyle"; // רכיב סטייל לתמונה

function Card({
  _id,
  title,
  subtitle,
  description,
  phone,
  email,
  web,
  imageUrl,
  imageAlt,
  state,
  country,
  city,
  street,
  houseNumber,
  zip,
  likes = [], // לייקים (אם לא הועברו, ברירת מחדל ריקה)
  onClickCard,
  onClickUpdate,
  onClickDelete,
  isMyCards,
  idInCardPage = false, // האם אנחנו בדף כרטיס
  onClickLike,
  onRemoveFavorite,
}) {
  const { user } = useAuth(); // קבלת פרטי המשתמש הנוכחי
  const isLiked = user ? likes.includes(user._id) : false; // בודק אם הכרטיס לייקי על ידי המשתמש

  // פונקציה ללחיצה על לייק
  const handleLikeCard = (cardId) => {
    onClickLike(cardId); // מקרא לפונקציה ללייק
  };

  const { VITE_GOOGLE_MAPS_API_KEY: KEY } = import.meta.env; // קבלת מפתח ה-API למפות של גוגל

  return (
    <div className={`card h-100 `}>
      <div>{idInCardPage ? onClickCard : ""}</div>
      <div className="row">
        <ImageStyle
          url={imageUrl} // URL לתמונה
          alt={imageAlt} // טקסט חלופי לתמונה
          click={() => !idInCardPage && onClickCard()} // אם לא בדף הכרטיס, הקרא לפונקציה
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text flex-grow-1">{description}</p>
      </div>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between">
          <a
            href={`https://wa.me/${phone}?text=שלום, רציתי לקבל פרטים נוספים`}
            className="card-link text-success"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-phone"></i> {/* אייקון טלפון */}
          </a>
          {/* הצגת רכיב לייק אם המשתמש מחובר */}
          {idInCardPage
            ? ""
            : user && (
                <LikeCard
                  id={_id}
                  isLiked={isLiked}
                  onLikeUpdate={() => handleLikeCard(_id)} // עדכון הלייק
                  onRemoveFavorite={onRemoveFavorite} // פונקציה להסרת מועדף
                />
              )}
        </div>
      </div>
      <ul className="list-group list-group-flush">
        {subtitle && <li className="list-group-item">Subtitle: {subtitle}</li>}
        {phone && <li className="list-group-item">Phone: {phone}</li>}
        {email && <li className="list-group-item">Email: {email}</li>}
        {web && <li className="list-group-item">Website: {web}</li>}
        {state && <li className="list-group-item">State: {state}</li>}
        {country && <li className="list-group-item">Country: {country}</li>}
        {city && <li className="list-group-item">City: {city}</li>}
        {street && <li className="list-group-item">Street: {street}</li>}
        {houseNumber && (
          <li className="list-group-item">House Number: {houseNumber}</li>
        )}
        {zip && <li className="list-group-item">ZIP: {zip}</li>}
      </ul>
      {idInCardPage && ( // אם בדף כרטיס, הראה מפה
        <div>
          <iframe
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${street}+${city}+${state}`} // מפה של גוגל
            className="w-100 h-100"
          />
        </div>
      )}
      {isMyCards && ( // אם הכרטיסים שייכים למשתמש הנוכחי
        <>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => onClickUpdate(_id)}
          >
            Edit Card {/* כפתור לעריכת הכרטיס */}
          </button>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => onClickDelete(_id)}
          >
            Delete Card {/* כפתור למחיקת הכרטיס */}
          </button>
        </>
      )}
    </div>
  );
}

export default Card; // ייצוא רכיב Card
