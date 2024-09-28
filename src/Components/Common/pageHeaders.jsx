function PageHeaders({ title, description }) {
  return (
    <div className="container my-3 align-center">
      <h1 className="text-center">{title}</h1> {/* כותרת ראשית, מרכזית */}
      <h5>{description}</h5> {/* תיאור נוסף, לא מרכזי */}
    </div>
  );
}

export default PageHeaders;
