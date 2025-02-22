import { BrowserRouter, Route,Routes } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
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
