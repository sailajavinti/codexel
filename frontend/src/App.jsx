import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Build from "./pages/Build";
import Auth from "./pages/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/build" element={<Build />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;