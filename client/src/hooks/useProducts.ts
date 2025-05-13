
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface Category {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  isPrimary: boolean;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  quantity: number;
  category?: string;
  category_id?: number;
  additionalImageIds?: Array<{id: number, isPrimary: boolean, imageType: string}>;
}

export const useProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<{[key: number]: ProductImage[]}>({});
  const [loadingImages, setLoadingImages] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    if (!userInfo.token || !userInfo.isAdmin || !userInfo.adminMode) {
      toast.error("You need admin privileges to access this page");
      navigate("/auth");
      return;
    }

    fetchProducts(userInfo.token);
    fetchCategories(userInfo.token);
  }, [navigate]);

  const fetchProducts = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch("http://localhost:4000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  // Get additional images for a specific product
  const getProductAdditionalImages = async (productId: number) => {
    setLoadingImages(prev => ({ ...prev, [productId]: true }));
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo.token) return;
      
      // Check if product has additional images
      const product = products.find(p => p.id === productId);
      if (!product?.additionalImageIds || product.additionalImageIds.length === 0) {
        setAdditionalImages(prev => ({...prev, [productId]: []}));
        return;
      }
      
      console.log(`Fetching additional images for product ${productId}`);
      
      // Load additional images for the product
      const imagePromises = product.additionalImageIds.map(async (img) => {
        const timestamp = new Date().getTime();
        const imageUrl = `http://localhost:4000/api/products/images/${img.id}?t=${timestamp}`;
        
        try {
          const response = await fetch(imageUrl, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            },
            cache: 'no-cache'
          });
          
          if (!response.ok) {
            throw new Error(`Failed to load image ${img.id}`);
          }
          
          return {
            id: img.id,
            isPrimary: img.isPrimary,
            imageUrl: imageUrl
          };
        } catch (error) {
          console.error(`Error loading image ${img.id}:`, error);
          return null;
        }
      });
      
      const loadedImages = (await Promise.all(imagePromises)).filter(img => img !== null) as ProductImage[];
      console.log(`Loaded ${loadedImages.length} additional images for product ${productId}`);
      setAdditionalImages(prev => ({...prev, [productId]: loadedImages}));
    } catch (error) {
      console.error(`Error loading additional images for product ${productId}:`, error);
    } finally {
      setLoadingImages(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    if (!userInfo.token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const getProductImageUrl = (productId: number) => {
    const timestamp = new Date().getTime();
    return `http://localhost:4000/api/products/${productId}/image?t=${timestamp}`;
  };

  return {
    products,
    setProducts,
    categories,
    loading,
    additionalImages,
    loadingImages,
    getProductAdditionalImages,
    handleDelete,
    getProductImageUrl,
    fetchProducts
  };
};
