import { useCard } from "../hooks/useCard"; // מייבא את הפונקציה useCard לקבלת נתוני הכרטיס
import Card from "../Components/Common/card"; // מייבא את רכיב הכרטיס להצגת פרטי הכרטיס
import { useParams } from "react-router-dom"; // מייבא את useParams לקבלת פרמטרים מהכתובת
import ErrorMessage from "../Components/Message/errorMsg"; // מייבא רכיב להצגת הודעת שגיאה
import LoadingMessage from "../Components/Message/loadingMsg"; // מייבא רכיב להצגת הודעת טעינה
import ResponsiveCard from "../Components/Common/responiveCard"; // מייבא רכיב כרטיס רספונסיבי

// רכיב CardPage מציג כרטיס בודד לפי מזהה שנשלח בכתובת
function CardPage() {
  const { id } = useParams(); // מקבל את מזהה הכרטיס מהכתובת
  const { card, error, loading } = useCard(id); // מקבל את הכרטיסים על ידי קריאה ל-hook useCard

  // אם יש שגיאה, מציג את הודעת השגיאה
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // אם הכרטיסים טוענים, מציג את הודעת הטעינה
  if (loading) {
    return <LoadingMessage message="card loading" />;
  }

  // מחזיר את רכיב הכרטיס יחד עם המידע שהתקבל
  return (
    <div className="d-flex justify-content-center pb-5 my-5">
      <ResponsiveCard className="m-auto col-md-11 col-lg-6 col-xl-8 col-xxl-8 pb-5">
        <Card
          _id={card._id} // מזהה הכרטיס
          imageUrl={card.image.url} // כתובת התמונה
          imageAlt={card.image.alt} // תיאור התמונה
          title={card.title} // כותרת הכרטיס
          description={card.description} // תיאור הכרטיס
          subtitle={card.subtitle} // תת כותרת
          phone={card.phone} // מספר טלפון
          email={card.email} // דוא"ל
          web={card.web} // אתר אינטרנט
          country={card.address.country} // מדינה
          city={card.address.city} // עיר
          state={card.address.state} // מדינה
          street={card.address.street} // רחוב
          houseNumber={card.address.houseNumber} // מספר בית
          zip={card.address.zip} // מיקוד
          likes={card.likes} // מספר לייקים
          idInCardPage={true} // פרופס של הכרטיס (כדי להציג את המידע הזה בעמוד הכרטיס)
        />
      </ResponsiveCard>
    </div>
  );
}

export default CardPage; // ייצוא רכיב CardPage
