import { BrowserRouter, Route,Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/dashboard"
import MvRoutes from "./app/MvRoute"



function App() {
 
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  ) 
}

export default App
