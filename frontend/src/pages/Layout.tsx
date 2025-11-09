import { Outlet } from "react-router-dom"
import Topbar from "../components/Topbar.tsx";
import Bottombar from "../components/Bottombar.tsx";


const Layout: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <Topbar />
      <Outlet />
      <div className="lg:hidden">
        <Bottombar></Bottombar>
      </div>
    </div>
  )
}

export default Layout;
