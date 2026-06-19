import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Chat from "./pages/Chat";

type ProtectedProps = {
  children: React.ReactNode;
};

function ProtectedRoute({
  children,
}: ProtectedProps) {
  const userId =
    localStorage.getItem("user_id");

  return userId
    ? children
    : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}