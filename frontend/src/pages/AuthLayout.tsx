import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import logo from '../assets/onlycat-removebg-preview.png'

const cardVariants = {
  initial: {
    x: 300,        
    opacity: 0,
    scale: 0.9,    
    rotate: 5,     
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring", 
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    x: -300,       
    opacity: 0,
    scale: 0.9,
    rotate: -5,
    transition: {
      duration: 0.3,
    },
  },
}

const AuthLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4 overflow-hidden">
      <div className="relative w-full max-w-md h-[500px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl p-8 absolute w-full border border-gray-100 flex flex-col items-center justify-center"
          >
          <div className="h-1/2 w-20 bg-black">
            <img src={logo} alt="Logo" className="h-1/2" />
          </div>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AuthLayout
