import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Register from "./pages/Register.jsx";
import Homepage from "./pages/Homepage.jsx";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
