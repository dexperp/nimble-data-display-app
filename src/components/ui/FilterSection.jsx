
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const FilterSection = ({ onFilter }) => {
  const [location, setLocation] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const handleFilter = () => {
    onFilter({
      location,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      sortBy
    });
  };

  const handleReset = () => {
    setLocation("All");
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSortBy("default");
    onFilter({});
  };

  return (
    <div className="bg-card shadow-sm rounded-lg border p-4">
      <h3 className="font-semibold mb-4">Filters</h3>
      
      <div className="space-y-5">
        {/* Location Filter */}
        <div>
          <Label htmlFor="location" className="mb-2 block">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Locations</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Asia">Asia</SelectItem>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="South America">South America</SelectItem>
              <SelectItem value="Africa">Africa</SelectItem>
              <SelectItem value="Oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Price Range Filter */}
        <div>
          <div className="flex justify-between mb-2">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <Slider
            defaultValue={priceRange}
            min={0}
            max={2000}
            step={100}
            onValueChange={setPriceRange}
            className="py-4"
          />
        </div>
        
        {/* Rating Filter */}
        <div>
          <div className="flex justify-between mb-2">
            <Label>Minimum Rating</Label>
            <span className="text-sm text-muted-foreground">{minRating.toFixed(1)}</span>
          </div>
          <Slider
            defaultValue={[minRating]}
            min={0}
            max={5}
            step={0.5}
            onValueChange={(values) => setMinRating(values[0])}
            className="py-4"
          />
        </div>
        
        {/* Sorting */}
        <div>
          <Label htmlFor="sortBy" className="mb-2 block">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleFilter} className="w-full">Apply Filters</Button>
          <Button onClick={handleReset} variant="outline" className="w-full">Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
