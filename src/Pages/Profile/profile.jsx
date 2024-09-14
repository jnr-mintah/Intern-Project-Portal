import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Profile/profile.css";
import Sidebar from "../Sidebar/side";
import human from "/src/assets/human.png"
import { faBell, faCircleQuestion, faGear, faQuestion, faUserAlt, faUserCheck, faWheelchair } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  return (
    <>
      <div className="profile">
        <Sidebar />
        <div className="profile-parent">
          <div className="contents">
            <div className="profile-nav">
              <div className="profile-text">
                <FontAwesomeIcon className="icon" icon={faUserCheck}/>
                <h1>Profile</h1>
              </div>
              <div className="settings-col">
                <FontAwesomeIcon icon={faGear}/>
                <FontAwesomeIcon icon={faBell}/>
                <FontAwesomeIcon icon={faCircleQuestion}/>
              </div>
            </div>

            <div className="main-info">
              <div className="person-info">
                <div className="face">
                  <div className="picture">
                    <img src="" alt="" />
                  </div>
                  <div className="name"></div>
                </div>
              </div>

              <div className="extra-info"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
