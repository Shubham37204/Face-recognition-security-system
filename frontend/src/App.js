import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Login from "./components/Login/Login";
import Account from './components/Account/Account';
import Forgot from "./components/Forgot/Forgot";
import Otp from "./components/Otp/Otp";
import AdminPanel from './components/Admins/AdminPanel';
import Face from './components/Face/Face';
import SearchAccount from './components/SearchAccount/SearchAccount';
import ModelGallery from "./components/ModelGallery/ModelGallery";
import EditAccount from "./components/EditAccount/EditAccount";
import More from "./components/More/More";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import EditFace from "./components/EditFace/EditFace";
import DeleteAccount from "./components/DeleteAccount/DeleteAccount";
import MatchFace from "./components/MatchFace/Match_Face";
import Welcome from "./components/Welcome/Welcome";
import ReviewForm from "./components/Reviews/ReviewForm";
import LoginTimeline from "./components/Timeline/LoginTimeline";
import Timeline from "./components/Timeline/Timeline";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/More" element={<More/>} />

        <Route path="/Welcome/:params" element={<Welcome />} />

        <Route element={<PrivateRoute />}>

          <Route path="/AdminPanel" element={<AdminPanel />} />

          <Route path="/Account" element={<Account />} />
          <Route path="/Otp" element={<Otp />} />
          <Route path="/Face" element={<Face />} />
          
          <Route path="/MatchFace" element={<MatchFace />} />
          <Route path="/folder/:user_id/:user_name" element={<EditAccount />} />
          <Route path="/EditFace/:user_id/:user_name/:imgCount" element={<EditFace />} />

          <Route path="/ModelGallery" element={<ModelGallery />} />

          <Route path="/SearchAccount" element={<SearchAccount />} />
          
          <Route path="/DeleteAccount" element={<DeleteAccount />} />

          <Route path="/Timeline" element={<Timeline />} />

          <Route path="/LoginTimeline" element={<LoginTimeline />} />

        </Route>

        <Route path="/Login" element={<Login />} />
        <Route path="/Forgot" element={<Forgot />} />
        <Route path="/ReviewForm" element={<ReviewForm />} />
      
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
