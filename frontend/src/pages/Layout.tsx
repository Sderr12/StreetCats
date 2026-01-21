import { Outlet } from "react-router-dom"
import Topbar from "../components/Topbar.tsx";
import Bottombar from "../components/Bottombar.tsx";
import Footer from "../components/Footer.tsx"

const Layout: React.FC = () => {
  return (
    <>
      <Topbar />

      <div className="flex min-h-screen flex-col  w-full">
        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
      </div>

      <div className="lg:hidden">
        <Bottombar />
      </div>
    </>
  )
}

export default Layout;
