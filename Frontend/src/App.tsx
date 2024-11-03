import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignupPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
