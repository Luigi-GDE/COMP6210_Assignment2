import { Link } from "react-router-dom";
//Nav bar for home and admin panel
function NavMenu() {
  return (
    <nav>
      <div className="item">
        <Link to="/home">
          <i className="bi bi-house"></i> Home
        </Link>
      </div>
      <div className="item">
        <Link to="/admin">
          <i className="bi bi-gear"></i> Admin Panel
        </Link>
      </div>
    </nav>
  );
}

export default NavMenu;
