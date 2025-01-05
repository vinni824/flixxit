import "./App.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import { getGenres, getUrlConfiguration } from "./store/actions";
import Auth from "./pages/auth/login";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { jwtDecode } from "jwt-decode";
import Mylist from "./pages/mylist/Mylist";
import VideoPlayer from "./components/videoPlayer/videoplayer";
import About from "./pages/about/about";
import Profile from "./pages/profile/profile";
import TermsAndConditions from "./pages/terms&conditions/Terms&Conditions";
import Privacy from "./pages/privacy/privacy";
export const isTokenValid = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime; // Check if token has expired
  } catch (err) {
    return false; // Invalid token
  }
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isTokenValid()) {
      dispatch(getUrlConfiguration());
      dispatch(getGenres());
    }
  }, []);

  // ProtectedRoute Component
  const ProtectedRoute = ({ element }) => {
    return isTokenValid() ? element : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms-of-use" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />

        <Route
          path="/:mediaType/:id"
          element={<ProtectedRoute element={<Details />} />}
        />
        <Route
          path="/search/:query"
          element={<ProtectedRoute element={<SearchResult />} />}
        />
        <Route
          path="/explore/:mediaType"
          element={<ProtectedRoute element={<Explore />} />}
        />
        <Route
          path="/mylist"
          element={<ProtectedRoute element={<Mylist />} />}
        />
        <Route
          path="/:id/videoplayer"
          element={<ProtectedRoute element={<VideoPlayer />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />

        {/* Catch-All Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
