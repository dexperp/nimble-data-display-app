
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">ExploreTrip</h3>
            <p className="text-muted-foreground">
              Discover the world with our curated selection of amazing destinations.
              Book your next adventure with us!
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Europe</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Asia</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">North America</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Africa</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Oceania</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">FAQs</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-4">Subscribe for travel tips and exclusive offers</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} ExploreTrip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
