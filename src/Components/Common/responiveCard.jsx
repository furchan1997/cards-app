import React from "react"; // ייבוא React

// רכיב Common שיטפל בעיצוב רספונסיבי של כרטיסים
const ResponsiveCard = ({ children, className }) => {
  return (
    <div
      className={`col-10 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 my-5${className}`} // עיצוב רספונסיבי לפי גדלי מסך
    >
      {children}
    </div>
  );
};

export default ResponsiveCard;
