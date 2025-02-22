import { BrowserRouter, Route,Routes } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import MvRoutes from "./app/MvRoute"
import Dashboard from "./pages/Dashboard/Dashboard"
import MvEmailVerify from "./pages/MvEmailVerify/MvEmailVerify"



function App() {
 
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.DASHBOARD} element={<Dashboard />} />
        <Route path={MvRoutes.EMAILVERIFY} element={<MvEmailVerify />} />
      </Routes>
    </BrowserRouter>
    </>
  ) 
}

export default App
