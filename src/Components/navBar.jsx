import { useState } from "react";
import { useAuth } from "../context/auth.context";
import { useCards } from "../hooks/useCards";
import Logo from "./logo";
import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../context/theme.context";
import { toast } from "react-toastify";

function NavBar({ onSearchResults }) {
  const { myUser, user, logout } = useAuth(); // משיכת נתוני משתמש מהקונטקסט
  const { cards } = useCards(); // משיכת כרטיסים מהקונטקסט
  const [searchTerm, setSearchTerm] = useState(""); // מצב לאחסון מונח החיפוש
  const { toggleTheme, theme, styles } = useTheme(); // משיכת פונקציות נושא וסגנונות

  // פונקציה לחיפוש כרטיסים
  const handleSearch = (ev) => {
    ev.preventDefault(); // מניעת שליחת הטופס
    const results = cards.filter((card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    onSearchResults(results); // החזרת התוצאות לרכיב Cards
  };

  const handleLogOut = () => {
    toast.success("you logout");
    logout(); // פונקציית התנתקות
  };

  const handleToggleTheme = () => {
    toggleTheme(); // הפעלת שינוי נושא
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav
          className={`navbar navbar-expand-xl ${styles.navClass} mx-auto mx-md-0`}
        >
          <Link className="navbar-brand" to="/">
            <Logo /> {/* רכיב לוגו */}
          </Link>
          {user && user.isBusiness && (
            <Link to="/create-card" className="btn btn-success">
              Add card + {/* כפתור להוספת כרטיס */}
            </Link>
          )}
          <span className="ms-2" onClick={handleToggleTheme}>
            {theme === "dark" ? (
              <i className="bi bi-brightness-low-fill"></i> // אייקון לאור
            ) : (
              <i className="bi bi-brightness-high-fill"></i> // אייקון לחושך
            )}
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>{" "}
            {/* אייקון למעבר בין תצוגות */}
          </button>
          <div
            className="collapse navbar-collapse p-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link active"
                  aria-current="page"
                  to="/about"
                >
                  About Us {/* קישור לעמוד אודות */}
                </NavLink>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link active"
                      aria-current="page"
                      to="/Favorits-cards"
                    >
                      Favorites Cards {/* קישור לכרטיסים מועדפים */}
                    </NavLink>
                  </li>
                  {user?.isBusiness && (
                    <>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link active"
                          aria-current="page"
                          to="/my-cards"
                        >
                          My Cards {/* קישור לכרטיסים שלי */}
                        </NavLink>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>

            <form
              className="d-flex mx-auto col-xs-10 col-xxl-4"
              role="search"
              onSubmit={handleSearch}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search" // שדה החיפוש
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // עדכון מונח החיפוש
              />
              <button
                className="btn btn-outline-success col-xs-10"
                onClick={handleSearch} // כפתור לחיפוש
              >
                Search
              </button>
            </form>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/"
                      onClick={handleLogOut} // קישור להתנתקות
                    >
                      Sign out
                    </Link>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link">
                      Hello, {myUser?.name.first} {/* ברכת שלום למשתמש */}
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link active"
                      aria-current="page"
                      to="/sign-in"
                    >
                      Sign In {/* קישור להתחברות */}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link active"
                      aria-current="page"
                      to="/sign-up"
                    >
                      Sign Up {/* קישור להרשמה */}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default NavBar; // ייצוא רכיב NavBar
