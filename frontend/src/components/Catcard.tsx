import image from '../assets/siamese-cat-new.png'

const Catcard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-94 m-2 p-1 hover:scale-90 transform transition-transform duration-300">
      <img src={image} alt={"cat"} className="w-full h-40 object-cover py-1 rounded-md" />
      <div className="p-4 border-t border-t-amber-200 bg-amber-100 opacity-80 rounded-b-xl">
        <h3 className="font-semibold text-lg text-amber-900">{"Name"}</h3>
        {<p className="text-gray-500 text-sm">{"distance"}</p>}
      </div>
    </div>
  );
}

export default Catcard;
