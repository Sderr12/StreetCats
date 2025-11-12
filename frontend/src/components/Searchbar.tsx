import search_white from '../assets/search-white.png'

const Searchbar = () => {
  return (

    <div className="flex items-center w-full h-1/2 bg-white/80 backdrop-blur-md border border-amber-300 rounded-full shadow-sm ">
      <input
        type="text"
        placeholder="Search for a place..."
        className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
      />
      <button className="bg-amber-400 hover:bg-amber-500 w-12 h-10 text-white rounded-r-full flex items-center justify-center border border-amber-300 transition-colors">
        <img src={search_white} className="w-5 h-5" alt="search" />
      </button>
    </div>
  )
}


export default Searchbar;
