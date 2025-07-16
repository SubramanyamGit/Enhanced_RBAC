import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";

function App() {
  return (

      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        {/* Add more protected or public routes here */}
      </Routes>

  );
}

export default App;
