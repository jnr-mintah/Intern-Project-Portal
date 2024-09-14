import { useState } from "react";
import "../SignUp/form.css";
import axios from "axios";
import { SpinnerRing } from "loaders-ui";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import localStorage from "react-secure-storage";
import logo from "/src/assets/cthLogo.png";

function Form() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setData] = useState({
    name: "",
    email: "",
    contact: "",
    school: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = isLogin
        ? await axios.post(
            "https://cth-interns-portal.onrender.com/api/intern/login",
            {
              email: formData.email,
              password: formData.password,
            }
          )
        : await axios.post(
            "https://cth-interns-portal.onrender.com/api/intern/signUp",
            formData
          );
  
      const successMessage = isLogin
        ? "Login Successful!"
        : response.data.message || "Sign Up Successful";
      toast.success(successMessage);
  
      const authToken = response.data.user?.token || response.data.token;
      const userId = response.data.user?.id || response.data.id;
  
      if (authToken && userId) {
        localStorage.setItem("token", authToken);
        localStorage.setItem("userId", userId);
  
        // Double-check that the values are stored before navigating
        console.log("Token:", localStorage.getItem("token"));
        console.log("UserId:", localStorage.getItem("userId"));
  
        // Ensure immediate navigation after sign-up or login
        navigate("/projects");
      } else {
        toast.error("Failed to retrieve authentication details.");
      }
  
      if (!isLogin) {
        setData({
          name: "",
          email: "",
          contact: "",
          school: "",
          password: "",
        });
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Registration"} Error:`, error);
      const errorMessage =
        error.response?.data?.message ||
        `An error occurred during ${isLogin ? "login" : "registration"}.`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
    

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setData({
      name: "",
      email: "",
      contact: "",
      school: "",
      password: "",
    });
  };

  return (
    <>
      <div className="parent">
        <div className="freeSpace"></div>
        <div className="forms1">
          <img src={logo} alt="" />
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                onChange={handleOnChange}
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                required
              />
            )}

            <input
              onChange={handleOnChange}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              required
            />

            {!isLogin && (
              <>
                <input
                  onChange={handleOnChange}
                  type="tel"
                  name="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  required
                />

                <input
                  onChange={handleOnChange}
                  type="text"
                  name="school"
                  placeholder="School"
                  value={formData.school}
                  required
                />
              </>
            )}

            <input
              onChange={handleOnChange}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              required
            />

            <div className="style-button">
              {loading ? (
                <div className="spinner-container">
                  <SpinnerRing
                    color="white"
                    borderWidth={4}
                    width="1.5rem"
                  />
                </div>
              ) : (
                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
              )}
            </div>

            <button onClick={toggleForm} className="toggle-form-button">
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </form>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </div>
    </>
  );
}

export default Form;
