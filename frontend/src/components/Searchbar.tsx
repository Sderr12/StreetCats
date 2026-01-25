import { useState } from "react"
import search_white from '../assets/search-white.png'
import { type SearchProps } from "../interfaces/SearchProps"

const Searchbar = ({ onSearch }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form inviato, query:", searchQuery); // Debug
    if (searchQuery.trim()) {
      console.log("Chiamando onSearch con:", searchQuery); // Debug
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full h-10 bg-white/80 backdrop-blur-md border border-amber-300 rounded-full shadow-sm">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          console.log("Input cambiato:", e.target.value); // Debug
          setSearchQuery(e.target.value);
        }}
        placeholder="Search for a place..."
        className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
      />
      <button
        type="submit"
        className="bg-amber-400 hover:bg-amber-500 w-12 h-10 text-white rounded-r-full flex items-center justify-center border border-amber-300 transition-colors"
      >
        <img src={search_white} className="w-5 h-5" alt="search" />
      </button>
    </form>
  )
}


export default Searchbar;
