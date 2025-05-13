
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, Grid3X3, List } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Define product type
interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  quantity: number;
}

// Fetch products from API
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const Products = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  
  // Use React Query to fetch products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  // Filter and sort products
  const filteredProducts = () => {
    if (!products) return [];
    
    return products
      .filter((product: Product) => {
        // Filter by search query
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filter by category
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        
        // Filter by price range
        const matchesPriceRange = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
          const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          switch (range) {
            case "under-50":
              return price < 50;
            case "50-100":
              return price >= 50 && price <= 100;
            case "100-200":
              return price > 100 && price <= 200;
            case "over-200":
              return price > 200;
            default:
              return true;
          }
        });
        
        return matchesSearch && matchesCategory && matchesPriceRange;
      })
      .sort((a: Product, b: Product) => {
        // Sort products
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        
        switch (sortBy) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "latest":
          default:
            return 0; // Keep original order for "latest"
        }
      });
  };
  
  // Handle price range selection
  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRanges(prev => {
      if (prev.includes(range)) {
        return prev.filter(r => r !== range);
      }
      return [...prev, range];
    });
  };
  
  // Extract unique categories from products and ensure it's a string array
  const categories: string[] = products 
    ? ["all", ...new Set(products.map((product: Product) => product.category || "Uncategorized").filter(Boolean) as string[])]
    : ["all"];
  
  // Placeholder for loading state
  if (isLoading) {
    return (
      <div className="py-24">
        <div className="container">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">All Products</h1>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              </div>
              
              <div>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="py-24">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Products</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the products. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  const filteredProductsList = filteredProducts();

  return (
    <div className="py-24">
      <div className="container">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">All Products</h1>
          <div className="flex items-center gap-4">
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[300px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Sort <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("latest")}>
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-asc")}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-desc")}>
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                  Name: A to Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                  Name: Z to A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex rounded-md border">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="font-medium mb-4">Categories</h2>
              <Tabs defaultValue="all" orientation="vertical" onValueChange={setSelectedCategory} value={selectedCategory}>
                <TabsList className="flex flex-col items-start justify-start h-auto">
                  {categories.map((category: string) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="w-full justify-start"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <h2 className="font-medium mb-4">Price Range</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedPriceRanges.includes("under-50")}
                    onChange={() => handlePriceRangeChange("under-50")}
                  />
                  <span>Under $50</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedPriceRanges.includes("50-100")}
                    onChange={() => handlePriceRangeChange("50-100")}
                  />
                  <span>$50 - $100</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedPriceRanges.includes("100-200")}
                    onChange={() => handlePriceRangeChange("100-200")}
                  />
                  <span>$100 - $200</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedPriceRanges.includes("over-200")}
                    onChange={() => handlePriceRangeChange("over-200")}
                  />
                  <span>$200+</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            {filteredProductsList.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-muted-foreground">
                  Try changing your search criteria or explore different categories.
                </p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProductsList.map((product: Product) => (
                  <ProductCard 
                    key={product.id}
                    id={Number(product.id)}
                    name={product.name}
                    price={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
                    category={product.category || "Uncategorized"}
                    description={product.description}
                    rating={4.5}
                    reviewCount={5}
                    image={`http://localhost:4000/api/products/${product.id}/image`}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProductsList.map((product: Product) => (
                  <div 
                    key={product.id}
                    className="flex flex-col md:flex-row gap-6 border rounded-lg p-4"
                  >
                    <div className="w-full md:w-48 h-48 rounded-md overflow-hidden">
                      <img 
                        src={`http://localhost:4000/api/products/${product.id}/image`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium">{product.name}</h2>
                      <p className="text-sm text-muted-foreground mb-2">{product.category || "Uncategorized"}</p>
                      <p className="mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</span>
                        <Button asChild>
                          <a href={`/products/${product.id}`}>View Details</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
