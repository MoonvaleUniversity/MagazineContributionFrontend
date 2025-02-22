import { BrowserRouter, Route,Routes } from "react-router-dom"
import Login from "./pages/MvAuth/MvLogin"
import Dashboard from "./pages/MvDashboard/MvDashboard"
import MvRoutes from "./app/MvRoutes"
import MvEmailVerify from "./pages/MvAuth/MvEmailVerify"



function App() {
 
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.DASHBOARD} element={<Dashboard />} />
        <Route path={MvRoutes.EMAIL_VERIFY} element={<MvEmailVerify />} />
      </Routes>
    </BrowserRouter>
    </>
  ) 
}

export default App
