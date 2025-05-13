
import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Flag } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  userHasMarkedHelpful?: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

// Fetch reviews from API
const fetchReviews = async (productId: string) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // If the endpoint doesn't exist yet, return the mock data
    return [];
  }
};

// Add a new review
const addReview = async (data: { 
  productId: string; 
  rating: number; 
  title: string; 
  comment: string;
}) => {
  const response = await axios.post('http://localhost:4000/api/reviews', data);
  return response.data;
};

// Mark review as helpful
const markReviewHelpful = async (reviewId: string) => {
  const response = await axios.post(`http://localhost:4000/api/reviews/${reviewId}/helpful`);
  return response.data;
};

// Report a review
const reportReview = async (reviewId: string) => {
  const response = await axios.post(`http://localhost:4000/api/reviews/${reviewId}/report`);
  return response.data;
};

const ProductReviews = ({ productId, reviews: initialReviews }: ProductReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState("5");
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  const queryClient = useQueryClient();
  
  // Fetch reviews using React Query
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
    initialData: initialReviews,
  });
  
  // Mutation for adding a review
  const addReviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      toast.success("Thank you for your review! It will be published after moderation.");
      resetForm();
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    }
  });
  
  // Mutation for marking a review as helpful
  const markHelpfulMutation = useMutation({
    mutationFn: markReviewHelpful,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      toast.success("Thank you for your feedback!");
    }
  });
  
  // Mutation for reporting a review
  const reportReviewMutation = useMutation({
    mutationFn: reportReview,
    onSuccess: () => {
      toast.success("Report submitted. We'll review this content.");
    }
  });
  
  const resetForm = () => {
    setShowReviewForm(false);
    setNewReviewTitle("");
    setNewReviewComment("");
    setNewReviewRating("5");
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReviewTitle.trim() || !newReviewComment.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    
    addReviewMutation.mutate({
      productId,
      rating: parseInt(newReviewRating),
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim()
    });
  };
  
  const markHelpful = (reviewId: string) => {
    markHelpfulMutation.mutate(reviewId);
  };
  
  const reportReviewHandler = (reviewId: string) => {
    reportReviewMutation.mutate(reviewId);
  };
  
  const sortedReviews = [...(reviewsData || [])].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!showReviewForm && (
            <Button 
              variant="outline" 
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Write a Review
            </Button>
          )}
        </div>
      </div>
      
      {showReviewForm && (
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="font-medium text-lg mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <Select 
                value={newReviewRating} 
                onValueChange={setNewReviewRating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">★★★★★ (5 Stars)</SelectItem>
                  <SelectItem value="4">★★★★☆ (4 Stars)</SelectItem>
                  <SelectItem value="3">★★★☆☆ (3 Stars)</SelectItem>
                  <SelectItem value="2">★★☆☆☆ (2 Stars)</SelectItem>
                  <SelectItem value="1">★☆☆☆☆ (1 Star)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="review-title" className="block text-sm font-medium mb-1">
                Review Title
              </label>
              <Input
                id="review-title"
                type="text"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
              />
            </div>
            
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium mb-1">
                Your Review
              </label>
              <Textarea
                id="review-comment"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
              />
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setShowReviewForm(false)}
                disabled={addReviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addReviewMutation.isPending}
              >
                {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {sortedReviews.length > 0 ? (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={review.userImage} alt={review.userName} />
                    <AvatarFallback>{review.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium">{review.title}</h4>
                <p className="mt-2 text-muted-foreground">{review.comment}</p>
                
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => markHelpful(review.id)}
                    className={`flex items-center gap-1 text-sm ${
                      review.userHasMarkedHelpful ? 'text-primary' : 'text-muted-foreground'
                    } hover:text-primary transition-colors`}
                    disabled={markHelpfulMutation.isPending}
                  >
                    <ThumbsUp size={14} />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  
                  <button
                    onClick={() => reportReviewHandler(review.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                    disabled={reportReviewMutation.isPending}
                  >
                    <Flag size={14} />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No Reviews Yet</h3>
          <p className="mt-1 text-muted-foreground">
            Be the first to review this product
          </p>
          {!showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="mt-4"
            >
              Write a Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
