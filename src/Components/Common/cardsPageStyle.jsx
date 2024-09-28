export const CardsPageStyle = ({ className, children }) => {
  return (
    <div
      className={`my-5 d-flex flex-wrap gap-3 justify-content-center m-auto ${className}`} // שילוב של מחלקות בוטסטראפ לעיצוב
      style={{ paddingBottom: "100px" }} // ריווח בתחתית
    >
      {children}
    </div>
  );
};

export default CardsPageStyle; // ייצוא רכיב CardsPageStyle
