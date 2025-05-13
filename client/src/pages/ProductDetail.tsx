import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  ChevronLeft, 
  Star, 
  Minus, 
  Plus, 
  Heart, 
  Share,
  Truck, 
  RefreshCcw, 
  ShieldCheck,
  Loader 
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/Button";
import ProductReviews, { Review } from "@/components/ProductReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";

const productReviews: Record<string, Review[]> = {
  "1": [
    {
      id: "r1",
      userId: "u101",
      userName: "Alex Thompson",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "2023-11-15",
      title: "Perfect for my home office",
      comment: "I've been using this lamp for a couple of months now in my home office. The light quality is excellent - no flickering, and I love the adjustable brightness. The design is sleek and looks much more expensive than it is. The touch controls are responsive and intuitive. Highly recommend!",
      helpful: 28,
      userHasMarkedHelpful: false
    },
    {
      id: "r2",
      userId: "u102",
      userName: "Jamie Chen",
      userImage: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "2023-10-22",
      title: "Great lamp, slightly wobbly base",
      comment: "The lamp looks beautiful and the light quality is great. I particularly like the warm light setting for evening work. My only complaint is that the base isn't quite as heavy as I'd like, so it can wobble a bit if bumped. Otherwise, it's perfect for my needs!",
      helpful: 15,
      userHasMarkedHelpful: true
    },
    {
      id: "r3",
      userId: "u103",
      userName: "Michael Patel",
      userImage: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      date: "2023-09-18",
      title: "Exceeded expectations",
      comment: "This is exactly what I needed for my desk. The adjustable arm means I can position it perfectly for what I'm working on, and the three brightness levels are well-considered. The build quality is excellent - it feels like it will last for years.",
      helpful: 32,
      userHasMarkedHelpful: false
    }
  ],
  "2": [
    {
      id: "r4",
      userId: "u104",
      userName: "Sarah Johnson",
      userImage: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 5,
      date: "2023-12-05",
      title: "Saved my back!",
      comment: "After months of working from home with a dining chair, this office chair has been a game-changer. My back pain has significantly decreased, and I can work comfortably for hours. The adjustability is fantastic - I can get it positioned perfectly for my height and desk.",
      helpful: 41,
      userHasMarkedHelpful: false
    },
    {
      id: "r5",
      userId: "u105",
      userName: "David Rodriguez",
      userImage: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 4,
      date: "2023-11-12",
      title: "Great chair, assembly was challenging",
      comment: "The chair itself is excellent - comfortable, supportive, and looks great in my office. The mesh back keeps me cool during long work sessions. My only complaint is that the assembly instructions weren't very clear, and it took me nearly an hour to put together.",
      helpful: 19,
      userHasMarkedHelpful: false
    }
  ],
  "3": [
    {
      id: "r6",
      userId: "u106",
      userName: "Emily Wilson",
      userImage: "https://randomuser.me/api/portraits/women/26.jpg",
      rating: 5,
      date: "2023-12-18",
      title: "Favorite mug in my collection",
      comment: "I love everything about this mug! The size is perfect - not too small, not too big. The handle is comfortable to hold, and the ceramic keeps my coffee hot for much longer than my other mugs. The design is simple but beautiful. I've already ordered two more as gifts.",
      helpful: 24,
      userHasMarkedHelpful: false
    },
    {
      id: "r7",
      userId: "u107",
      userName: "Jason Miller",
      userImage: "https://randomuser.me/api/portraits/men/43.jpg",
      rating: 4,
      date: "2023-11-30",
      title: "Beautiful craftsmanship",
      comment: "You can tell this mug is handmade with care. The glaze is beautiful and each one has subtle variations that make it unique. My only minor complaint is that it's slightly heavier than I expected, but that also speaks to its quality. A wonderful addition to my morning routine.",
      helpful: 12,
      userHasMarkedHelpful: false
    }
  ],
  "5": [
    {
      id: "r8",
      userId: "u108",
      userName: "Olivia Park",
      userImage: "https://randomuser.me/api/portraits/women/29.jpg",
      rating: 5,
      date: "2023-10-28",
      title: "Gorgeous craftsmanship",
      comment: "This side table is absolutely beautiful! The wood grain is stunning, and the construction is rock solid. It was easy to assemble and looks much more expensive than it was. It's the perfect height next to my sofa, and the surface is smooth and well-finished.",
      helpful: 37,
      userHasMarkedHelpful: false
    },
    {
      id: "r9",
      userId: "u109",
      userName: "Robert Garcia",
      userImage: "https://randomuser.me/api/portraits/men/55.jpg",
      rating: 4,
      date: "2023-09-15",
      title: "Excellent quality, slightly darker than pictured",
      comment: "The table arrived well-packaged and was simple to assemble. The construction is solid and feels very sturdy. My only note is that the finish is slightly darker than it appears in the photos, but it still looks beautiful and matches my decor well.",
      helpful: 18,
      userHasMarkedHelpful: false
    }
  ],
  "7": [
    {
      id: "r10",
      userId: "u110",
      userName: "Sophia Lee",
      userImage: "https://randomuser.me/api/portraits/women/46.jpg",
      rating: 5,
      date: "2023-11-08",
      title: "Sleek and perfectly silent",
      comment: "This clock is exactly what I wanted for my minimalist living room. The design is clean and modern, and most importantly, it's completely silent! No annoying ticking sounds. The movement is smooth, and it keeps perfect time. Very happy with this purchase.",
      helpful: 29,
      userHasMarkedHelpful: false
    },
    {
      id: "r11",
      userId: "u111",
      userName: "Thomas Wright",
      userImage: "https://randomuser.me/api/portraits/men/29.jpg",
      rating: 4,
      date: "2023-10-03",
      title: "Stylish with minor installation quirks",
      comment: "The clock looks fantastic on my wall - very modern and easy to read. The silent movement is great for my home office where I can't stand ticking sounds. Installation was slightly tricky as the hanging mechanism isn't the most intuitive, but once up, it's secure and looks great.",
      helpful: 14,
      userHasMarkedHelpful: false
    }
  ]
};

interface ProductImage {
  id: number;
  isPrimary: boolean;
  imageType: string;
}

interface ProductFromAPI {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  category_id: number | null;
  additionalImageIds?: ProductImage[];
  created_at: string;
  updated_at: string;
}

const fetchProduct = async (id: string) => {
  console.log("Fetching product with ID:", id);
  const response = await axios.get(`http://localhost:4000/api/products/${id}`);
  console.log("Product data received:", response.data);
  return response.data;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  // Ensure id is properly parsed and used
  const productId = id ? id.toString() : "";
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: productId !== "",
  });
  
  const reviews = productReviews[id || ""] || [];
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const getImageUrl = (imageId: number) => {
    return `http://localhost:4000/api/products/images/${imageId}`;
  };
  
  const getMainImageUrl = (productId: number) => {
    return `http://localhost:4000/api/products/${productId}/image`;
  };
  
  const getProductImages = () => {
    if (!product) return [];
    
    const mainImageUrl = getMainImageUrl(product.id);
    
    const additionalImages = product.additionalImageIds?.map(img => ({
      id: img.id,
      url: getImageUrl(img.id),
      isPrimary: img.isPrimary
    })) || [];
    
    return [
      { id: 'main', url: mainImageUrl, isPrimary: true },
      ...additionalImages
    ];
  };
  
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
    }
  }, [product]);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Cannot add more than available stock");
    }
  };
  
  const addToCartHandler = () => {
    if (product) {
      const imageUrl = productImages.length > 0 ? productImages[0].url : '';
      
      addToCart({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: imageUrl,
        quantity: quantity
      });
      
      toast.success(`${quantity} × ${product.name} added to cart`);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? `Removed from favorites` : `Added to favorites`);
  };
  
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "Product",
        text: product?.description || "Check out this product",
        url: window.location.href,
      });
    } else {
      toast.success(`Link copied to clipboard`);
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (error) {
    console.error("Error loading product:", error);
    return (
      <div className="container py-20 text-center">
        <h1 className="heading-lg mb-6">Error Loading Product</h1>
        <p className="text-muted-foreground mb-8">
          There was an error loading this product. Please try again later.
        </p>
        <Link 
          to="/products" 
          className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-20">
        <div className="container">
          <div className="mb-6">
            <Link 
              to="/products" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <div className="flex gap-3">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="w-20 h-20 rounded-md" />
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-6" />
              <Skeleton className="h-6 w-1/4 mb-8" />
              
              <div className="border-t pt-6">
                <Skeleton className="h-20 w-full mb-6" />
                
                <Skeleton className="h-4 w-1/3 mb-4" />
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full mb-3" />
                ))}
              </div>
              
              <div className="mt-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start">
                    <Skeleton className="h-6 w-6 mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-1/3 mb-1" />
                      <Skeleton className="h-3 w-full" />
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

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="heading-lg mb-6">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }
  
  const productImages = getProductImages();

  const specifications = [
    { name: "Category", value: product.category || "Uncategorized" },
    { name: "Availability", value: product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock" },
    { name: "Product ID", value: `#${product.id}` },
    { name: "Added", value: new Date(product.created_at).toLocaleDateString() },
    { name: "Last Updated", value: new Date(product.updated_at).toLocaleDateString() }
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="container">
        <div className="mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
              {selectedImage !== null && productImages.length > 0 ? (
                <img 
                  src={productImages[selectedImage].url} 
                  alt={product.name}
                  className="h-full w-full object-cover object-center animate-scale-in"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <Loader className="animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 overflow-hidden rounded-md bg-gray-50 ${
                      selectedImage === index 
                        ? "ring-2 ring-primary ring-offset-2" 
                        : "hover:ring-1 hover:ring-primary/50 hover:ring-offset-1"
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={`${product.name} - View ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="animate-fade-in">
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">{product.category}</span>
            </div>
            
            <h1 className="heading-lg">{product.name}</h1>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                4.5 ({reviews.length} reviews)
              </span>
            </div>
            
            <div className="mt-4">
              <span className="text-2xl font-bold">${Number(product.price).toFixed(2)}</span>
              {product.quantity > 0 ? (
                <span className="ml-3 text-sm font-medium text-green-600">In Stock ({product.quantity})</span>
              ) : (
                <span className="ml-3 text-sm font-medium text-red-600">Out of Stock</span>
              )}
            </div>
            
            <div className="mt-6 border-t pt-6">
              <p className="text-muted-foreground">
                {product.description}
              </p>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>Quality assured product</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>Fast shipping worldwide</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="w-10 text-center">{quantity}</span>
                  
                  <button 
                    onClick={increaseQuantity}
                    disabled={product.quantity <= quantity}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <Button 
                  onClick={addToCartHandler}
                  fullWidth
                  disabled={product.quantity === 0}
                >
                  Add to Cart
                </Button>
                
                <button
                  onClick={toggleFavorite}
                  className="w-10 h-10 rounded-full flex items-center justify-center border hover:bg-secondary transition-colors"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    size={18} 
                    className={isFavorite ? "fill-red-500 text-red-500" : ""} 
                  />
                </button>
                
                <button
                  onClick={shareProduct}
                  className="w-10 h-10 rounded-full flex items-center justify-center border hover:bg-secondary transition-colors"
                  aria-label="Share product"
                >
                  <Share size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <Truck size={18} className="mr-3 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-muted-foreground">Free standard shipping on orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <RefreshCcw size={18} className="mr-3 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Easy Returns</h4>
                  <p className="text-sm text-muted-foreground">30-day return policy for unused items</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ShieldCheck size={18} className="mr-3 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Quality Guarantee</h4>
                  <p className="text-sm text-muted-foreground">1-year warranty on all products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="animate-fade-in">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
                <p className="leading-relaxed">
                  This high-quality product is made with attention to detail and durable materials. 
                  Perfect for everyday use and designed to last, it offers excellent value for 
                  your investment. Our team carefully selects only the best materials and 
                  components to ensure you receive a premium product that exceeds expectations.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="animate-fade-in">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{spec.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="animate-fade-in">
              <ProductReviews productId={String(product.id)} reviews={reviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
