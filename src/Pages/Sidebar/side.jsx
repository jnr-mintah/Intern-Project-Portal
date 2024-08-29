import "../Sidebar/side.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faFile, faUsers } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import logo from "/src/assets/cthLogo.png"


function Sidebar() {

  const sidebarItems = [
    { text: "Projects", icon: faRocket, path: "/projects" },
    { text: "Reports", icon: faFile, path: "/reporting" },
    { text: "Profile", icon: faUsers, path: "/profile" },
  ];

  return (
    <aside>
      <figure className="cth-logo">
        <img className="sideLogo" src={logo} alt="Code Coast Logo" />
      </figure>

      <div className="item-list">
        <ul className="sidebar-list">
          {sidebarItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <div className="hold">
                  <span className="item-icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <span className="item-text">{item.text}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
