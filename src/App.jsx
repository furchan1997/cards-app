import { Route, Routes } from "react-router-dom";
import Footer from "./Components/footer";
import Header from "./Components/header";
import About from "./Pages/about";
import SignIn from "./Pages/signIn";
import SignUp from "./Pages/signUp";
import CreateCard from "./Pages/creatCards";
import ProtectedRoute from "./Components/Common/prodectedRouts";
import Cards from "./Pages/cards";
import CardPage from "./Pages/cardPage";
import MyCards from "./Pages/myCards";
import UpdataCards from "./Pages/updataCards";
import FavoriteCards from "./Pages/favotiteCards";
import { useState } from "react";
import NavBar from "./Components/navBar";
import { useTheme } from "./context/theme.context";

function App() {
  const [searchResults, setSearchResults] = useState([]); // מצב לתוצאות חיפוש

  const handleSearchResults = (results) => {
    setSearchResults(results); // שמור את התוצאות במצב
  };

  const { styles } = useTheme();

  return (
    <div className={styles.bodyClass}>
      <div className={"app min-vh-100 d-flex flex-column"}>
        <Header />
        <NavBar onSearchResults={handleSearchResults} />
        <main className="flex-fill">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Cards searchResults={searchResults} />} />
            <Route path="/cards/:id" element={<CardPage />} />
            <Route path="/Favorits-cards" element={<FavoriteCards />} />

            <Route
              path="/create-card"
              element={
                <ProtectedRoute onlyBiz>
                  <CreateCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-cards"
              element={
                <ProtectedRoute onlyBiz>
                  <MyCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cards"
              element={
                <ProtectedRoute onlyBiz>
                  <MyCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-cards/update/:id"
              element={
                <ProtectedRoute onlyBiz>
                  <UpdataCards />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
