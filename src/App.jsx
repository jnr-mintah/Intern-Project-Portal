import "./App.css";
import "loaders-ui/dist/main/index.min.css";
import { BouncingBalls, ExpandingCircle, Infinite, Spinner } from "loaders-ui";
import Form from "./SignUp/form";
import Projects from './Pages/My Projects/projects';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
// import Profile from "./Pages/Report/report";
import Report from "./Pages/Profile/profile";
import Profile from "./Pages/Profile/profile";
import Reporting from "./Pages/Reporting/reporting";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="reporting" element={<Reporting/>}/>
        </Routes>
      </Router>
      {/* <Form/> */}
      {/* <Sidebar/> */}
    </>
  );
}

export default App;
