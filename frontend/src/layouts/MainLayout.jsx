import Navbar from "../components/Navbar.jsx"
import {Outlet} from "react-router-dom"

export default function MainLayout(){
  return(
    <>
      <Navbar/>
      <div className="p-5">
        <Outlet/>
      </div>
    </>
  )
}
