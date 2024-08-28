import "../Profile/profile.css";
import Sidebar from "../Sidebar/side";
import human from "/src/assets/human.png"

function Profile() {
  return (
    <>
      <div className="profile">
        <Sidebar />
        <div className="profile-side">
            <div className="head">
                <div className="profile-pic">
                    <img className="human" src={human} alt="" />
                </div>
                <div className="bio"></div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
