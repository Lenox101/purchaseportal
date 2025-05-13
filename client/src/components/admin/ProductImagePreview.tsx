
import React from "react";
import { Image } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ProductImage, Product } from "@/hooks/useProducts";

interface ProductImagePreviewProps {
  product: Product;
  additionalImages: ProductImage[];
  isLoading: boolean;
  getProductImageUrl: (productId: number) => string;
  onLoadImages: (productId: number) => void;
  onEdit: (product: Product) => void;
}

const ProductImagePreview: React.FC<ProductImagePreviewProps> = ({
  product,
  additionalImages,
  isLoading,
  getProductImageUrl,
  onLoadImages,
  onEdit
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div 
          className="relative cursor-pointer h-12 w-12 rounded overflow-hidden bg-muted"
          onClick={() => {
            if (!additionalImages && product.additionalImageIds && product.additionalImageIds.length > 0) {
              onLoadImages(product.id);
            }
          }}
        >
          <img 
            src={getProductImageUrl(product.id)} 
            alt={product.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          {product.additionalImageIds && product.additionalImageIds.length > 0 && (
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-tl flex items-center">
              <Image className="h-3 w-3 mr-1" />
              {product.additionalImageIds.length}
            </div>
          )}
        </div>
      </PopoverTrigger>
      {product.additionalImageIds && product.additionalImageIds.length > 0 && (
        <PopoverContent className="w-80 p-3">
          <div className="space-y-2">
            <h4 className="font-medium">Product Images</h4>
            
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Array.from({ length: product.additionalImageIds.length }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : additionalImages && additionalImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="aspect-square rounded overflow-hidden">
                  <img
                    src={getProductImageUrl(product.id)}
                    alt={`Main image for ${product.name}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                {additionalImages.map((image) => (
                  <div key={image.id} className="aspect-square rounded overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={`Additional image for ${product.name}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional images found.
              </p>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => onEdit(product)}
            >
              Edit Images
            </Button>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default ProductImagePreview;
