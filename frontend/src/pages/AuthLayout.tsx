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
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-100 px-4 py-2 overflow-y-auto dark:bg-slate-800">

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 flex flex-col items-center my-auto dark:bg-slate-800"
        >
          <div className="w-24 mb-6 flex justify-center">
            <img src={logo} alt="Logo" className="w-full h-auto" />
          </div>

          <div className="w-full">
            <Outlet />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AuthLayout
