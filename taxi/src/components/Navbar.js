import { Link } from "react-router-dom";
import "../styles/navbar.css"

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Taksi sistem</h1>
      <div className="links">
        <Link to="/">Pocetna</Link>
        <Link to="/login">Prijava</Link>
        <Link to="/register">Registracija</Link>
      </div>
    </nav>
  );
}
 
export default Navbar;