
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const DestinationCard = ({ destination }) => {
  const { id, name, image, description, rating, price, location, tags } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link to={`/destination/${id}`} className="block h-full">
        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary/90 hover:bg-primary">${price}</Badge>
            </div>
          </div>
          
          <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                <span className="text-sm">{rating.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{description}</p>
            
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">
                {location}
              </Badge>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 border-t mt-auto">
            {tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;
