
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/api/apiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, MapPin, CheckCircle, XCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await apiService.getBookingsByUser(user.id);
        setBookings(data);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
        toast.error("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);
  
  const cancelBooking = async (bookingId) => {
    try {
      await apiService.deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error(error);
    }
  };
  
  // Filter bookings based on active tab
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.startDate) > new Date() && booking.status === "confirmed"
  );
  
  const pastBookings = bookings.filter(booking => 
    new Date(booking.endDate) < new Date() || booking.status === "completed"
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.name}! Manage your trips and bookings.
            </p>
          </motion.div>
          
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="past">Past Trips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              {upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="mb-4">You don't have any upcoming trips.</p>
                    <Button onClick={() => navigate("/")}>Explore Destinations</Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingBookings.map((booking, index) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onCancel={() => cancelBooking(booking.id)} 
                    index={index}
                    isPast={false}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6">
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p>You don't have any past trips.</p>
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking, index) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    index={index}
                    isPast={true}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const BookingCard = ({ booking, onCancel, index, isPast }) => {
  const { destination, startDate, endDate, guests, totalPrice, status } = booking;
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 h-48 md:h-auto">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{destination.location}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  {status === "confirmed" ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Confirmed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center text-muted-foreground mb-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Check-in</span>
                  </div>
                  <p>{format(parseISO(startDate), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <div className="flex items-center text-muted-foreground mb-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Check-out</span>
                  </div>
                  <p>{format(parseISO(endDate), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Guests</div>
                  <p>{guests}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-muted-foreground">Total Price:</span>
                  <span className="ml-2 font-semibold text-lg">${totalPrice}</span>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/destination/${destination.id}`)}
                  >
                    View Details
                  </Button>
                  
                  {!isPast && (
                    <Button variant="destructive" onClick={onCancel}>
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
