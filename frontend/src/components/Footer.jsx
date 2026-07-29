import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1f2937",
        color: "#fff",
        padding: "30px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Logo */}
        <div>
          <h2 style={{ marginBottom: "10px" }}>MyApp</h2>
          <p style={{ color: "#d1d5db", maxWidth: "250px" }}>
            Building modern web applications with React.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3>Quick Links</h3>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <Link to="/" style={linkStyle}>
              Home
            </Link>
            <Link to="/about" style={linkStyle}>
              About
            </Link>
            <Link to="/contact" style={linkStyle}>
              Contact
            </Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3>Contact</h3>
          <p>Email: info@myapp.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <hr
        style={{
          margin: "25px 0 15px",
          borderColor: "#374151",
        }}
      />

      <p
        style={{
          textAlign: "center",
          color: "#9ca3af",
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </p>
    </footer>
  );
}

const linkStyle = {
  color: "#d1d5db",
  textDecoration: "none",
};

export default Footer;