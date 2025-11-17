import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import type { Cat } from "../interfaces/"

const CatDetails = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");


  const { id } = useParams<{ id: string }>();
  const [cat, setCat] = useState<Cat>({
    id: 0,
    name: "",
    description: "",
    image: ""
  });


  const mockFetchCat = async (id: number): Promise<Cat | null> => {
    await new Promise((r) => setTimeout(r, 300));
    if (id <= 0 || id > 9999) return null;
    return {
      id,
      name: `Spotted Cat #${id}`,
      description: "A friendly stray spotted near the park.",
      image: "https://placekitten.com/1200/800",
    };
  };



  return (
    <div className="w-full h-full overflow-y-scroll lg:flex lg:flex-row">
      <div className="lg:hidden mt-23 w-full text-center text-4xl font-semibold">
        Spotted cat
      </div>
      <section
        className="lg:hidden relative bg-red-400 h-screen w-full flex lg:flex-row bg-cover bg-center lg:bg-[center_40%]"
      >
      </section>

      {/* Second Section */}
      <section
        id="second"
        className="lg:w-2/3 w-full h-screen bg-gray-400 flex items-top justify-center flex-col"
      >
        <h2 className="lg:hidden text-4xl font-bold text-white text-center">Description</h2>


        {/* Here starts Details and position on map for larger display */}
        <h2 className="hidden lg:block mt-23 text-4xl font-bold text-white text-center"> Spotted Cat </h2>

        <div className="bg-red-900 w-full h-full">
        </div>
      </section>


      <section
        id="third"
        className="w-full lg:w-1/3 h-screen bg-gray-700 flex items-top justify-center flex-col "
      >
        <h2 className="lg:mt-23 text-4xl font-bold text-white text-center">Comments</h2>


        <div className="bg-white w-full h-full">
        </div>
      </section>



      <footer className="lg:hidden bg-gray-900 text-gray-300 py-8 px-6 pb-10 lg:pb-2">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">StreetCats</h3>
            <p className="text-sm text-gray-400">
              Let's help cats, one pawn at time! 🐾
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-white mb-2">Explore</h4>
            <ul className="space-y-1">
              <li><a href="/home" className="hover:text-amber-400">Home</a></li>
              <li><a href="/map" className="hover:text-amber-400">Map</a></li>
              <li><a href="/about" className="hover:text-amber-400">Who are we?</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-1">
              <li><a href="/contact" className="hover:text-amber-400">Contacts</a></li>
              <li><a href="/privacy" className="hover:text-amber-400">Privacy</a></li>
              <li><a href="/terms" className="hover:text-amber-400">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} StreetCats — All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default CatDetails;
