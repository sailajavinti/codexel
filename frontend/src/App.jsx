import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Build from "./pages/build/Build";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Profile from "./pages/profile/Profile";

import Header from "./components/Header";
import Footer from "./components/Footer";


function AppLayout() {
  const location = useLocation();

  const isBuildPage = location.pathname === "/build";
  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {/* Main Website Header */}
      {!isBuildPage && <Header />}

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Application */}
        <Route path="/build" element={<Build />} />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

      {/* Main Website Footer */}
      {!isBuildPage && !isAuthPage && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}


export default App;