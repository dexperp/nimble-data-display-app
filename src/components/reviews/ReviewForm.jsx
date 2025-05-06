
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import apiService from "@/api/apiService";

const ReviewForm = ({ destinationId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset error
    setCommentError("");
    
    // Validate comment
    if (!comment.trim()) {
      setCommentError("Please enter your review");
      isValid = false;
    } else if (comment.trim().length < 10) {
      setCommentError("Review must be at least 10 characters");
      isValid = false;
    }
    
    // Validate rating
    if (rating === 0) {
      toast.error("Please select a rating");
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a review");
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        destinationId,
        userId: user.id,
        userName: user.name,
        rating,
        comment
      };
      
      const newReview = await apiService.createReview(reviewData);
      
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(0);
      
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to submit a review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center mb-4">
            <span className="mr-2 text-sm">Your Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-5 w-5 ${
                      value <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {rating}/5
              </span>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none h-32"
            />
            {commentError && (
              <p className="text-destructive text-sm mt-1">{commentError}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewForm;
