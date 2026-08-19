import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Build from "./pages/build/Build";

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

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/build" element={<Build />} />

        <Route path="/auth" element={<Auth />} />

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