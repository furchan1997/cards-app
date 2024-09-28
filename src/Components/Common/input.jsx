function Input({ label, type, ...rest }) {
  // בדיקה אם סוג הקלט הוא 'checkbox'
  if (type === "checkbox") {
    return (
      <div className="mb-3">
        <label htmlFor={rest.name} className="form-label">
          {label}
        </label>
        <input
          type={type}
          {...rest}
          className={["form-check-input", rest.error && "is-invalid"]
            .filter(Boolean)
            .join(" ")} // שילוב מחלקות CSS לפי תנאי, אם יש שגיאה
          id={rest.name}
          onChange={rest.onChange} // טיפול בשינוי הערך
          defaultChecked={rest.checked} // קובע אם התיבה מסומנת כברירת מחדל
        />
        <div className="invalid-feedback">{rest.error}</div> {/* הצגת שגיאות */}
      </div>
    );
  }

  // עבור קלטים אחרים
  return (
    <div className="mb-3">
      <label htmlFor={rest.name} className="form-label">
        {label}
        {rest.required && <span className="text-danger ms-1">*</span>}{" "}
        {/* סימן חובה */}
      </label>
      <input
        type={type}
        {...rest}
        className={["form-control", rest.error && "is-invalid"]
          .filter(Boolean)
          .join(" ")} // שילוב מחלקות CSS לפי תנאי, אם יש שגיאה
        id={rest.name}
      />
      <div className="invalid-feedback">{rest.error}</div> {/* הצגת שגיאות */}
    </div>
  );
}

export default Input;
