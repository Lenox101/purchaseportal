
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductImagePreview from "./ProductImagePreview";
import { Product, ProductImage } from "@/hooks/useProducts";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  additionalImages: {[key: number]: ProductImage[]};
  loadingImages: {[key: number]: boolean};
  getProductAdditionalImages: (productId: number) => void;
  handleDelete: (id: number) => void;
  getProductImageUrl: (productId: number) => string;
  onEdit: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  additionalImages,
  loadingImages,
  getProductAdditionalImages,
  handleDelete,
  getProductImageUrl,
  onEdit
}) => {
  const formatPrice = (price: number | string): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice)) {
        return numPrice.toFixed(2);
      }
    }
    return '0.00';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">Loading products...</TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">No products found</TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductImagePreview
                    product={product}
                    additionalImages={additionalImages[product.id] || []}
                    isLoading={loadingImages[product.id] || false}
                    getProductImageUrl={getProductImageUrl}
                    onLoadImages={getProductAdditionalImages}
                    onEdit={onEdit}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate">{product.name}</div>
                </TableCell>
                <TableCell>${formatPrice(product.price)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.category || "Uncategorized"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
