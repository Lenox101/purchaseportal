
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductForm, { FormData } from "@/components/admin/ProductForm";
import ProductsTable from "@/components/admin/ProductsTable";
import { useProducts, Product } from "@/hooks/useProducts";
import { toast } from "sonner";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { 
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
  } = useProducts();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handleOpenEditDialog = (product: Product) => {
    console.log("Opening edit dialog for product:", product);
    setCurrentProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    if (!userInfo.token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      let url = "http://localhost:4000/api/products";
      let method = "POST";

      if (isEditing && currentProduct) {
        url = `http://localhost:4000/api/products/${currentProduct.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} product`);
      }

      const updatedProduct = await response.json();
      
      if (isEditing) {
        setProducts(products.map(p => p.id === currentProduct?.id ? {...p, ...updatedProduct} : p));
      } else {
        setProducts([...products, updatedProduct]);
      }
      
      toast.success(`Product ${isEditing ? "updated" : "created"} successfully`);
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh products data after successful submission
      fetchProducts(userInfo.token);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} product`);
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 pt-20">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold pb-7 pr-10">Products</h1>
          <p className="text-muted-foreground">Manage your store products</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreateDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {isEditing ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(90vh-120px)]">
                  <div className="px-1 py-2">
                    <ProductForm
                      initialData={currentProduct}
                      onSubmit={handleSubmit}
                      onCancel={() => {
                        resetForm();
                        setIsDialogOpen(false);
                      }}
                      categories={categories}
                    />
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <ProductsTable
        products={products}
        loading={loading}
        additionalImages={additionalImages}
        loadingImages={loadingImages}
        getProductAdditionalImages={getProductAdditionalImages}
        handleDelete={handleDelete}
        getProductImageUrl={getProductImageUrl}
        onEdit={handleOpenEditDialog}
      />
    </div>
  );
};

export default AdminProducts;
