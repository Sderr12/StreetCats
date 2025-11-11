import binoculars from '../assets/binoculars-white.png'
import map from '../assets/map-white.png'
import home from '../assets/home-white.png'


import { useNavigate } from 'react-router-dom'

const Bottombar = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-gray-900 border-b border-t-gray-200 bottom-0 left-0 w-full shadow-md flex justify-around items-center h-12 z-50">
      <button className="bg-amber-400 w-9 h-9 rounded-full flex flex-col items-center justify-center"
        onClick={() => navigate("/map")}>
        <img src={map} alt={"map"} className='w-6 h-6 ' />
      </button>
      <button className="bg-amber-400 w-9 h-9 rounded-full flex flex-col items-center justify-center"
        onClick={() => navigate("/home")}>
        <img src={home} alt={"home"} className='w-6 h-6 ' />
      </button>
      <button className="bg-amber-400 w-9 h-9 rounded-full flex flex-col items-center justify-center"
        onClick={() => navigate("/")}>
        <img src={binoculars} alt={"binoculars"} className='w-6 h-6 ' />
      </button>
    </div>
  )
}

export default Bottombar;
