
import { useRef } from "react";
import { ImagePlus, Star, StarOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImage {
  id: number;
  isPrimary: boolean;
  previewUrl: string;
}

interface ProductImageUploaderProps {
  existingImages: ProductImage[];
  additionalImagePreviews: string[];
  onSetPrimary: (imageId: number) => void;
  onDeleteImage: (imageId: number) => void;
  onRemoveAdditionalImage: (index: number) => void;
  onAddImages: (files: FileList) => void;
  primaryImageId: number | null;
  maxImages?: number;
  mainImage?: string | null;
  onMainImageChange?: (file: File | null) => void;
  onMainImageRemove?: () => void;
  containerClassName?: string;
  isLoadingImages?: boolean;
}

const ProductImageUploader = ({
  existingImages,
  additionalImagePreviews,
  onSetPrimary,
  onDeleteImage,
  onRemoveAdditionalImage,
  onAddImages,
  primaryImageId,
  maxImages = 4,
  mainImage,
  onMainImageChange,
  onMainImageRemove,
  containerClassName = "",
  isLoadingImages = false,
}: ProductImageUploaderProps) => {
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  
  const getTotalImagesCount = () => {
    return (mainImage ? 1 : 0) + existingImages.length + additionalImagePreviews.length;
  };
  
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onMainImageChange && file) {
      console.log("Changing main image to:", file.name);
      onMainImageChange(file);
    }
    // Reset the input
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = "";
    }
  };
  
  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const remainingSlots = maxImages - (existingImages.length + additionalImagePreviews.length);
    
    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} additional images allowed. Extra images ignored.`);
    }
    
    console.log(`Adding ${Math.min(files.length, remainingSlots)} images`);
    onAddImages(files);
    
    // Reset the input
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.value = "";
    }
  };
  
  const triggerMainFileInput = () => {
    if (mainFileInputRef.current) {
      mainFileInputRef.current.click();
    }
  };
  
  const triggerMultipleFileInput = () => {
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.click();
    }
  };
  
  return (
    <div className={`space-y-3 ${containerClassName}`}>
      {/* Main Image - Hidden input, clickable area */}
      {onMainImageChange && (
        <div className="space-y-1 border rounded-lg p-4 bg-card">
          <Label className="text-sm font-medium">Main Product Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            ref={mainFileInputRef}
            className="hidden"
          />
          <div 
            className="h-[150px] w-full border-2 border-dashed rounded-md flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={triggerMainFileInput}
          >
            {isLoadingImages ? (
              <Skeleton className="h-full w-full rounded-md" />
            ) : mainImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={mainImage} 
                  alt="Product preview" 
                  className="h-full w-full object-contain p-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMainImageRemove) {
                      onMainImageRemove();
                    }
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <div className="text-center p-4">
                <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground mt-2">Click to upload main image</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Images - Hidden input, clickable grid */}
      <div className="space-y-2 border rounded-lg p-4 bg-card">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">
            Additional Images ({getTotalImagesCount() - (mainImage ? 1 : 0)}/{maxImages})
          </Label>
          {getTotalImagesCount() >= maxImages + 1 && (
            <span className="text-xs text-amber-600">Maximum {maxImages + 1} images allowed (1 main + {maxImages} additional)</span>
          )}
        </div>
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultipleFileChange}
          ref={multipleFileInputRef}
          className="hidden"
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {isLoadingImages ? (
            // Show skeletons while loading
            Array.from({ length: maxImages }).map((_, index) => (
              <Skeleton key={`skeleton-${index}`} className="h-[120px] w-full rounded-md" />
            ))
          ) : (
            Array.from({ length: maxImages }).map((_, index) => {
              const existingImage = existingImages[index];
              const newImagePreview = additionalImagePreviews[index - existingImages.length] || null;
              const hasImage = existingImage || newImagePreview;

              return (
                <div 
                  key={`placeholder-${index}`} 
                  className={`h-[120px] w-full border-2 border-dashed rounded-md flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors relative cursor-pointer ${
                    existingImage && (existingImage.isPrimary || existingImage.id === primaryImageId) ? 'border-amber-500' : ''
                  }`}
                  onClick={() => {
                    if (!hasImage && getTotalImagesCount() - (mainImage ? 1 : 0) < maxImages) {
                      triggerMultipleFileInput();
                    }
                  }}
                >
                  {existingImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={existingImage.previewUrl} 
                        alt={`Product image ${index+1}`} 
                        className="h-full w-full object-contain p-2"
                      />
                      <div className="absolute top-1 right-1 flex space-x-1">
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetPrimary(existingImage.id);
                          }}
                          title={existingImage.isPrimary || existingImage.id === primaryImageId ? "Primary image" : "Set as primary"}
                        >
                          {existingImage.isPrimary || existingImage.id === primaryImageId ? (
                            <Star size={14} className="text-amber-500" />
                          ) : (
                            <StarOff size={14} />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteImage(existingImage.id);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ) : newImagePreview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={newImagePreview} 
                        alt={`New image ${index+1}`} 
                        className="h-full w-full object-contain p-2"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveAdditionalImage(additionalImagePreviews.indexOf(newImagePreview));
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground/60" />
                      <p className="text-xs text-muted-foreground mt-1">Click to add image</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <p className="text-xs text-muted-foreground">Upload up to {maxImages} additional product images. Click the star icon to set an image as primary.</p>
      </div>
    </div>
  );
};

export default ProductImageUploader;
