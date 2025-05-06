
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      guests: 1
    }
  });
  
  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please log in to book this trip");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate number of days
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      
      // Calculate total price
      const totalPrice = destination.price * days * data.guests;
      
      // Create booking object
      const bookingData = {
        userId: user.id,
        destinationId: destination.id,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
        guests: data.guests,
        totalPrice
      };
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Booking successful!");
      form.reset();
      
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Trip</CardTitle>
        <CardDescription>
          ${destination.price} per person / night
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              rules={{ required: "Start date is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || 
                          (form.getValues("endDate") && date > form.getValues("endDate"))
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              rules={{ required: "End date is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || 
                          (form.getValues("startDate") && date < form.getValues("startDate"))
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Number of Guests */}
            <FormField
              control={form.control}
              name="guests"
              rules={{ 
                required: "Number of guests is required",
                min: { value: 1, message: "Minimum 1 guest required" },
                max: { value: 10, message: "Maximum 10 guests allowed" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10} 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Calculate Price */}
            {form.watch("startDate") && form.watch("endDate") && form.watch("guests") > 0 && (
              <div className="p-3 border rounded-md bg-muted/30">
                <h4 className="font-medium mb-2">Price Summary</h4>
                <div className="space-y-1 text-sm">
                  {(() => {
                    const start = new Date(form.watch("startDate"));
                    const end = new Date(form.watch("endDate"));
                    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
                    const guests = form.watch("guests");
                    const pricePerNight = destination.price * guests;
                    const totalPrice = pricePerNight * days;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>${destination.price} × {guests} guests</span>
                          <span>${pricePerNight} / night</span>
                        </div>
                        <div className="flex justify-between">
                          <span>${pricePerNight} × {days} nights</span>
                          <span>${totalPrice}</span>
                        </div>
                        <div className="border-t mt-2 pt-2 font-medium flex justify-between">
                          <span>Total</span>
                          <span>${totalPrice}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isSubmitting || !form.formState.isValid || !user}
        >
          {isSubmitting ? "Processing..." : user ? "Book Now" : "Login to Book"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
