
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Star } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

const ReviewList = ({ reviews, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-destructive">Error loading reviews: {error}</p>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 border rounded-lg">
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center mb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-medium">
              {review.userName.charAt(0)}
            </div>
            <div className="ml-3">
              <h4 className="font-medium">{review.userName}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <time dateTime={review.date}>
                  {format(parseISO(review.date), "MMMM d, yyyy")}
                </time>
              </div>
            </div>
          </div>
          <p className="text-foreground">{review.comment}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;
