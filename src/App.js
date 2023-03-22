import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PubliceRoute";
import useAuthHook from "./Hooks/useAuthHook";
import Conversation from "./pages/Conversation";
import Inbox from "./pages/Inbox";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const authChecked = useAuthHook();

  return !authChecked ? (
    <div>auth checking....</div>
  ) : (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <PrivateRoute>
              <Conversation />
            </PrivateRoute>
          }
        />
        <Route
          path="/inbox/:id"
          element={
            <PrivateRoute>
              <Inbox />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
 // {
    //   "email": "sumit@learnwithsumit.com",
    //   "password": "$2a$10$CtHS.yCGS80jiuZx8yKEI.5zdiZykHF/6aPTDqpHl6ZqEFGISOHKO",
    //   "name": "Sumit Saha",
    //   "id": 1
    // },