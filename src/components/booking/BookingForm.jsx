
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const BookingForm = ({ destination, onBookingComplete }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    
    if (!startDate) {
      errors.startDate = "Start date is required";
    }
    
    if (!endDate) {
      errors.endDate = "End date is required";
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.endDate = "End date must be after start date";
    }
    
    if (guests < 1) {
      errors.guests = "Minimum 1 guest required";
    }
    
    if (guests > 10) {
      errors.guests = "Maximum 10 guests allowed";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const calculatePrice = () => {
    if (!startDate || !endDate || !guests) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const pricePerNight = destination.price * guests;
    const totalPrice = pricePerNight * days;
    
    return {
      days,
      guests,
      pricePerNight,
      totalPrice
    };
  };
  
  const handleGuestsChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setGuests(Math.max(1, Math.min(10, value)));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to book this trip");
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate price
      const price = calculatePrice();
      
      // Create booking object
      const bookingData = {
        userId: user.id,
        destinationId: destination.id,
        startDate: format(new Date(startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(endDate), 'yyyy-MM-dd'),
        guests,
        totalPrice: price.totalPrice
      };
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Booking successful!");
      setStartDate(null);
      setEndDate(null);
      setGuests(1);
      
      if (onBookingComplete) {
        onBookingComplete(bookingData);
      }
    } catch (error) {
      toast.error("Booking failed. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const price = calculatePrice();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Trip</CardTitle>
        <CardDescription>
          ${destination.price} per person / night
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="font-medium text-sm">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  {startDate ? (
                    format(new Date(startDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => setStartDate(date?.toISOString())}
                  disabled={(date) =>
                    date < new Date() || 
                    (endDate && date > new Date(endDate))
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {formErrors.startDate && (
              <p className="text-destructive text-sm">{formErrors.startDate}</p>
            )}
          </div>
          
          {/* End Date */}
          <div className="space-y-2">
            <label className="font-medium text-sm">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  {endDate ? (
                    format(new Date(endDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ? new Date(endDate) : undefined}
                  onSelect={(date) => setEndDate(date?.toISOString())}
                  disabled={(date) =>
                    date < new Date() || 
                    (startDate && date < new Date(startDate))
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {formErrors.endDate && (
              <p className="text-destructive text-sm">{formErrors.endDate}</p>
            )}
          </div>
          
          {/* Number of Guests */}
          <div className="space-y-2">
            <label className="font-medium text-sm">Number of Guests</label>
            <Input 
              type="number" 
              min={1} 
              max={10} 
              value={guests}
              onChange={handleGuestsChange}
            />
            {formErrors.guests && (
              <p className="text-destructive text-sm">{formErrors.guests}</p>
            )}
          </div>
          
          {/* Calculate Price */}
          {price && (
            <div className="p-3 border rounded-md bg-muted/30">
              <h4 className="font-medium mb-2">Price Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>${destination.price} × {price.guests} guests</span>
                  <span>${price.pricePerNight} / night</span>
                </div>
                <div className="flex justify-between">
                  <span>${price.pricePerNight} × {price.days} nights</span>
                  <span>${price.totalPrice}</span>
                </div>
                <div className="border-t mt-2 pt-2 font-medium flex justify-between">
                  <span>Total</span>
                  <span>${price.totalPrice}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit} 
          disabled={isSubmitting || !startDate || !endDate || !user}
        >
          {isSubmitting ? "Processing..." : user ? "Book Now" : "Login to Book"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
