import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#282c34",
        color: "white",
      }}
    >
      <h2>CODEXEL</h2>

      <nav style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          Home
        </Link>

        <Link
          to="/login"
          style={{ color: "white", textDecoration: "none" }}
        >
          Login
        </Link>

        <Link
          to="/contact"
          style={{ color: "white", textDecoration: "none" }}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default Header;