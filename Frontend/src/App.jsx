import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./AuthProvider.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { Route, Routes } from "react-router-dom";

import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import Left from "./Home/LeftPart/Left.jsx";
import Right from "./Home/RightPart/Right.jsx";

const ChatLayout = () => {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <Left />
      <Right />
    </div>
  );
};

const AppContent = () => {
  const { authUser } = useAuth();

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatLayout /> : <Login />}
        />

        <Route
          path="/login"
          element={authUser ? <ChatLayout /> : <Login />}
        />

        <Route
          path="/signup"
          element={authUser ? <ChatLayout /> : <Signup />}
        />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  </AuthProvider>
);

export default App;