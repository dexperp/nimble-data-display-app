
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Star, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Skeleton from "@/components/ui/Skeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/booking/BookingForm";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import apiService from "@/api/apiService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const DestinationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch destination details
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoadingDestination(true);
        const data = await apiService.getDestinationById(id);
        setDestination(data);
      } catch (err) {
        setError(err.message || "Failed to load destination details");
        toast.error("Failed to load destination details");
      } finally {
        setIsLoadingDestination(false);
      }
    };
    
    fetchDestination();
  }, [id]);
  
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const data = await apiService.getReviewsByDestination(id);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews", err);
        // Don't show error toast for reviews, just log it
      } finally {
        setIsLoadingReviews(false);
      }
    };
    
    fetchReviews();
  }, [id]);
  
  const handleNewReview = (newReview) => {
    setReviews([...reviews, newReview]);
  };
  
  const handleBookingComplete = (bookingData) => {
    // In a real app, you would navigate to the dashboard or booking confirmation page
    console.log("Booking completed:", bookingData);
  };

  // Loading state
  if (isLoadingDestination) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error || !destination) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">Error</h1>
            <p className="mb-8">{error || "Destination not found"}</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Destinations
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{destination.name}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{destination.location}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                </div>
                <Badge className="bg-primary/90 hover:bg-primary text-lg font-semibold">
                  ${destination.price}
                </Badge>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Destination Image */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Destination Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-foreground mb-6">{destination.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {destination.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Activities */}
                {destination.activities && destination.activities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Activities</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {destination.activities.map(activity => (
                        <li key={activity} className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Reviews Section */}
              <div>
                <Tabs defaultValue="reviews">
                  <TabsList className="mb-6">
                    <TabsTrigger value="reviews">
                      Reviews ({reviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="add-review">
                      Write a Review
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reviews">
                    <ReviewList 
                      reviews={reviews} 
                      isLoading={isLoadingReviews} 
                      error={null} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="add-review">
                    <ReviewForm 
                      destinationId={destination.id} 
                      onReviewSubmitted={handleNewReview} 
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
            
            {/* Booking Form Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <BookingForm 
                  destination={destination}
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DestinationDetails;
