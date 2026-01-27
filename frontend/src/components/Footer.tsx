
const Footer = () => {
  return (
    <footer className="bg-gray-200 py-12 px-6 pb-24 lg:pb-12 text-gray-500">
      <div className="max-w-7xl mx-auto">

        {/* Colonne */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 place-items-center text-center">

          <div className="flex flex-col items-center max-w-xs">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Explore</h4>
            <ul className="space-y-2">
              <li>
                <a href="/home" className="hover:text-amber-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/map" className="hover:text-amber-400 transition-colors">
                  Map
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-amber-400 transition-colors">
                  Who are we?
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="hover:text-amber-400 transition-colors">
                  Contacts
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Get Involved
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center justify-center gap-4 text-center md:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} StreetCats — All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  )
}


export default Footer;
