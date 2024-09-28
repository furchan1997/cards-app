import { useEffect, useState } from "react";

export const ImageStyle = ({ url, alt, click, height, objectFit, width }) => {
  // הגדרת state עבור מחלקות התמונה
  const [imageClass, setImageClass] = useState({
    height: height || "200px", // גובה ברירת מחדל
    objectFit: objectFit || "cover", // אופן תצוגת התמונה (ברירת מחדל 'cover')
    width: width || "100%", // רוחב ברירת מחדל
  });

  // פונקציה לעדכון מחלקות התמונה לפי רוחב החלון
  const updateImageClass = () => {
    if (window.innerWidth > 1600) {
      // בדיקה אם רוחב החלון גדול מ-1600 פיקסלים
      setImageClass({
        height: "400px",
        objectFit: "cover",
        width: "100%",
      });
    }
  };

  useEffect(() => {
    updateImageClass(); // קריאה ראשונית לעדכון מחלקות התמונה
    window.addEventListener("resize", updateImageClass); // הוספת מאזין לאירוע גודל חלון

    // פונקציה לניקוי: מסירה את המאזין כאשר רכיב מתUnmount
    return () => {
      window.removeEventListener("resize", updateImageClass); // מסיר את המאזין
    };
  }, []); // ריצה פעם אחת כאשר הרכיב נטען

  // החזרת התמונה עם סגנון שהוגדר
  return <img src={url} style={imageClass} alt={alt} onClick={click} />;
};
