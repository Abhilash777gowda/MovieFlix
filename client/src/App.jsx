import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import NewAndPopular from "./pages/NewAndPopular";
import Search from "./pages/Search";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/new-popular" element={<NewAndPopular />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search" element={<Search />} />
          </Routes>
          <Footer />
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
