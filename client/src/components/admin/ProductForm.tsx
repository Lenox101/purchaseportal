import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductImageUploader from "./ProductImageUploader";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number | string;
  quantity: number;
  category?: string;
  category_id?: number | null;
  additionalImageIds?: Array<{id: number, isPrimary: boolean, imageType: string}>;
}

interface ProductImage {
  id: number;
  isPrimary: boolean;
  previewUrl: string;
}

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
}

export interface FormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: any;
  image_type: string | null;
  additionalImages: any[];
  primaryImageId: number | null;
  category_id: number | null;
  new_category?: string;
}

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0.01, "Price must be greater than 0")
  ),
  quantity: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Quantity must be 0 or greater")
  ),
  category_id: z.string().optional(),
  new_category: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm = ({ initialData, onSubmit, onCancel, categories }: ProductFormProps) => {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<number | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData ? Number(initialData.price) : "" as any,
      quantity: initialData ? Number(initialData.quantity) : 0,
      category_id: initialData?.category_id ? String(initialData.category_id) : "",
      new_category: "",
    },
  });
  
  useEffect(() => {
    const loadExistingProductData = async () => {
      if (!initialData || !initialData.id) return;
      
      setIsLoadingImages(true);
      
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const token = userInfo.token;
        const timestamp = new Date().getTime();
        const mainImageUrl = `http://localhost:4000/api/products/${initialData.id}/image?t=${timestamp}`;
        
        const mainImageResponse = await fetch(mainImageUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          method: 'GET',
          cache: 'no-cache'
        });
        
        if (mainImageResponse.ok) {
          const blob = await mainImageResponse.blob();
          const previewUrl = URL.createObjectURL(blob);
          setImagePreview(previewUrl);
        }

        if (initialData.additionalImageIds?.length) {
          const imagePromises = initialData.additionalImageIds.map(async (img) => {
            const imageUrl = `http://localhost:4000/api/products/images/${img.id}?t=${timestamp}`;
            const response = await fetch(imageUrl, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              method: 'GET',
              cache: 'no-cache'
            });
            
            if (response.ok) {
              const blob = await response.blob();
              return {
                id: img.id,
                isPrimary: img.isPrimary,
                previewUrl: URL.createObjectURL(blob)
              };
            }
            return null;
          });
          
          const loadedImages = (await Promise.all(imagePromises)).filter(Boolean) as ProductImage[];
          setExistingImages(loadedImages);
          
          const primaryImage = loadedImages.find(img => img.isPrimary);
          if (primaryImage) setPrimaryImageId(primaryImage.id);
        }
      } catch (error) {
        console.error("Error loading product images:", error);
        toast.error("Failed to load product images");
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    loadExistingProductData();
    
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      additionalImagePreviews.forEach(url => URL.revokeObjectURL(url));
      existingImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [initialData]);
  
  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategoryInput(true);
      form.setValue("category_id", "");
    } else {
      setShowNewCategoryInput(false);
      form.setValue("category_id", value);
      form.setValue("new_category", "");
    }
  };
  
  const handleMainImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddImages = (files: FileList) => {
    const maxAdditionalImages = 4;
    const remainingSlots = maxAdditionalImages - (existingImages.length + additionalImageFiles.length);
    const fileArray = Array.from(files).slice(0, remainingSlots);
    
    if (fileArray.length > 0) {
      setAdditionalImageFiles(prev => [...prev, ...fileArray]);
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const handleRemoveAdditionalImage = (index: number) => {
    const newFiles = [...additionalImageFiles];
    const newPreviews = [...additionalImagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setAdditionalImageFiles(newFiles);
    setAdditionalImagePreviews(newPreviews);
  };
  
  const handleSetPrimary = (imageId: number) => {
    setPrimaryImageId(imageId);
    setExistingImages(existingImages.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })));
  };
  
  const handleDeleteImage = async (imageId: number) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    if (!userInfo.token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/products/images/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (!response.ok) throw new Error("Failed to delete image");

      setExistingImages(existingImages.filter(img => img.id !== imageId));
      if (primaryImageId === imageId) setPrimaryImageId(null);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
    }
  };
  
  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      let mainImageData = null;
      
      if (imageFile) {
        mainImageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const additionalImagesData = await Promise.all(
        additionalImageFiles.map(file => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }))
      );
      
      const formData: FormData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        quantity: Number(values.quantity),
        image: mainImageData,
        image_type: imageFile ? imageFile.type : null,
        additionalImages: additionalImagesData,
        primaryImageId: primaryImageId,
        category_id: values.category_id ? parseInt(values.category_id, 10) : null,
        new_category: values.new_category
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit product form");
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-10 pr-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0.01" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                      value={field.value === 0 ? "" : field.value}
                      className="h-9" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter product description" 
                    className="min-h-[80px] resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0" 
                      {...field} 
                      className="h-9" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={handleCategoryChange} 
                    defaultValue={field.value || undefined}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Category</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {showNewCategoryInput && (
            <FormField
              control={form.control}
              name="new_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new category name" {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <ProductImageUploader
          existingImages={existingImages}
          additionalImagePreviews={additionalImagePreviews}
          onSetPrimary={handleSetPrimary}
          onDeleteImage={handleDeleteImage}
          onRemoveAdditionalImage={handleRemoveAdditionalImage}
          onAddImages={handleAddImages}
          primaryImageId={primaryImageId}
          mainImage={imagePreview}
          onMainImageChange={handleMainImageChange}
          onMainImageRemove={() => {
            setImageFile(null);
            setImagePreview(null);
          }}
          isLoadingImages={isLoadingImages}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;