import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/SignUp" element={} />
        <Route path="/LogIn" element={} /> */}
      </Routes>
    </>
  );
}

export default App;
