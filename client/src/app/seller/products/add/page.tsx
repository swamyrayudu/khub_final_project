"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addProduct } from '@/actions/productActions';
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories';
import ImageUpload from '@/components/ui/image-upload';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Hash, 
  Weight, 
  Ruler, 
  Tag,
  Save,
  Loader2,
  X,
  ShoppingBag,
  ImageIcon,
  Percent,
  MapPin
} from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  offerPrice: string;
  quantity: string;
  category: string;
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
  tags: string;
  images: string[];
  googleMapsUrl: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    quantity: '',
    category: '',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    tags: '',
    images: [],
    googleMapsUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.offerPrice && parseFloat(formData.offerPrice) >= parseFloat(formData.price)) {
      newErrors.offerPrice = 'Offer price must be less than regular price';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.weight && parseFloat(formData.weight) < 0) {
      newErrors.weight = 'Weight cannot be negative';
    }

    if (formData.sku && formData.sku.length > 0 && formData.sku.length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters if provided';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    // Validate Google Maps URL format if provided
    if (formData.googleMapsUrl && formData.googleMapsUrl.trim() !== '') {
      const googleMapsPatterns = [
        /^https?:\/\/(www\.)?google\.[a-z]+\/maps/i,
        /^https?:\/\/maps\.google\.[a-z]+/i,
        /^https?:\/\/goo\.gl\/maps/i,
        /^https?:\/\/maps\.app\.goo\.gl/i
      ];
      
      const isValid = googleMapsPatterns.some(pattern => pattern.test(formData.googleMapsUrl));
      
      if (!isValid) {
        newErrors.googleMapsUrl = 'Please provide a valid Google Maps URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    startTransition(async () => {
      try {
        const serverFormData = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'images') {
            serverFormData.append('images', JSON.stringify(value));
          } else if (typeof value === 'string' && value.trim()) {
            serverFormData.append(key, value.trim());
          } else if (typeof value === 'string') {
            serverFormData.append(key, value);
          }
        });

        console.log("📤 Submitting product data...");
        const result = await addProduct(serverFormData);

        if (result.success) {
          toast.success(result.message, {
            duration: 3000,
          });

          setFormData({
            name: '', description: '', price: '', offerPrice: '', quantity: '',
            category: '', brand: '', sku: '', weight: '',
            dimensions: '', tags: '', images: [], googleMapsUrl: ''
          });
          setErrors({});

          setTimeout(() => {
            router.push('/seller/viewproducts');
          }, 1500);
        } else {
          toast.error(result.message, {
            duration: 5000,
          });
        }

      } catch (error) {
        console.error('Submit error:', error);
        toast.error('Failed to add product. Please try again.');
      }
    });
  };

  const handleClearForm = () => {
    setFormData({
      name: '', description: '', price: '', offerPrice: '', quantity: '',
      category: '', brand: '', sku: '', weight: '',
      dimensions: '', tags: '', images: [], googleMapsUrl: ''
    });
    setErrors({});
  };

  const discountPercentage = formData.price && formData.offerPrice 
    ? Math.round(((parseFloat(formData.price) - parseFloat(formData.offerPrice)) / parseFloat(formData.price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 py-3 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          {/* Mobile Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              disabled={isPending}
              className="h-9 w-9 p-0 hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Mobile Title */}
          <div className="md:hidden text-center mb-4">
            <h1 className="text-2xl font-bold text-card-foreground mb-1">Add New Product</h1>
            <p className="text-sm text-muted-foreground px-2">Add a new product to your inventory and start selling</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                disabled={isPending}
                className="bg-card border-border"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">Add New Product</h1>
                <p className="text-muted-foreground">Add a new product to your inventory and start selling</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Form Card - Responsive Optimized */}
        <div className="bg-card rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl border border-border backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-7">
            
            {/* Basic Information */}
            <Card className="border-border bg-background/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3 sm:pb-5 lg:pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-2.5 text-lg sm:text-xl lg:text-2xl">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <span className="font-semibold">Basic Information</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base mt-2">Enter the essential details of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6 pt-4 sm:pt-5 lg:pt-6">
                
                {/* Product Name */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter a clear, descriptive product name"
                    required
                    disabled={isPending}
                    className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && <p className="text-xs sm:text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="description" className="text-xs sm:text-sm font-medium text-card-foreground">
                    Product Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product features, benefits, and specifications..."
                    rows={4}
                    disabled={isPending}
                    className="bg-background border-border text-sm sm:text-base min-h-[100px] resize-y"
                  />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-7">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="category" className="text-xs sm:text-sm font-medium text-card-foreground">
                      Category
                    </Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="bg-background border-border h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.name} className="text-sm sm:text-base">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="brand" className="text-xs sm:text-sm font-medium text-card-foreground">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      disabled={isPending}
                      className="bg-background border-border text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card className="border-border bg-background/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3 sm:pb-5 lg:pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-2.5 text-lg sm:text-xl lg:text-2xl">
                  <div className="bg-blue-600/10 p-2 rounded-lg">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <span className="font-semibold">Product Images</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base mt-2">
                  Upload high-quality images of your product to attract customers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-5 lg:pt-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium text-card-foreground">
                    Product Images *
                  </Label>
                  <ImageUpload
                    value={formData.images}
                    onChange={handleImageChange}
                    disabled={isPending}
                    maxFiles={5}
                  />
                  {errors.images && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.images}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card className="border-border bg-background/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3 sm:pb-5 lg:pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-2.5 text-lg sm:text-xl lg:text-2xl">
                  <div className="bg-green-600/10 p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <span className="font-semibold">Pricing & Inventory</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base mt-2">Set your product pricing and stock information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6 pt-4 sm:pt-5 lg:pt-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-7">
                  {/* Regular Price */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="price" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                      Regular Price (₹) *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 ${errors.price ? 'border-destructive' : ''}`}
                      required
                      disabled={isPending}
                    />
                    {errors.price && <p className="text-xs sm:text-sm text-destructive">{errors.price}</p>}
                  </div>

                  {/* Offer Price */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="offerPrice" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                      <Percent className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                      Offer Price (₹)
                      {discountPercentage > 0 && (
                        <span className="ml-2 text-green-600 text-xs sm:text-sm font-semibold">
                          ({discountPercentage}% off)
                        </span>
                      )}
                    </Label>
                    <Input
                      id="offerPrice"
                      name="offerPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.offerPrice}
                      onChange={handleInputChange}
                      placeholder="0.00 (optional)"
                      className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 ${errors.offerPrice ? 'border-destructive' : ''}`}
                      disabled={isPending}
                    />
                    {errors.offerPrice && <p className="text-xs sm:text-sm text-destructive">{errors.offerPrice}</p>}
                    <p className="text-xs text-muted-foreground">
                      Set a lower price to offer discounts to customers
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="quantity" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                    Quantity in Stock *
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 w-full sm:max-w-xs ${errors.quantity ? 'border-destructive' : ''}`}
                    required
                    disabled={isPending}
                  />
                  {errors.quantity && <p className="text-xs sm:text-sm text-destructive">{errors.quantity}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="border-border bg-background/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3 sm:pb-5 lg:pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-2.5 text-lg sm:text-xl lg:text-2xl">
                  <div className="bg-red-600/10 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                  <span className="font-semibold">Location Information</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base mt-2">
                  Add your product&apos;s location to help customers find you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 lg:space-y-5 pt-4 sm:pt-5 lg:pt-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="googleMapsUrl" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                    Google Maps URL
                  </Label>
                  <Input
                    id="googleMapsUrl"
                    name="googleMapsUrl"
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={handleInputChange}
                    placeholder="https://maps.google.com/..."
                    disabled={isPending}
                    className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 ${errors.googleMapsUrl ? 'border-destructive' : ''}`}
                  />
                  {errors.googleMapsUrl && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.googleMapsUrl}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Paste the Google Maps link of your product location. The coordinates will be extracted automatically.
                  </p>
                  <div className="mt-2 p-2.5 sm:p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs font-medium text-card-foreground mb-1">How to get Google Maps URL:</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside pl-1">
                      <li>Open Google Maps and search for your location</li>
                      <li>Click &quot;Share&quot; and then &quot;Copy link&quot;</li>
                      <li>Paste the link here</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card className="border-border bg-background/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3 sm:pb-5 lg:pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-2.5 text-lg sm:text-xl lg:text-2xl">
                  <div className="bg-purple-600/10 p-2 rounded-lg">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <span className="font-semibold">Additional Details</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base mt-2">Optional information to help manage your inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6 pt-4 sm:pt-5 lg:pt-6">
                
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="sku" className="text-xs sm:text-sm font-medium text-card-foreground">
                    SKU (Stock Keeping Unit)
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="e.g., TSHIRT-001 (leave empty to auto-generate)"
                    disabled={isPending}
                    className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 ${errors.sku ? 'border-destructive' : ''}`}
                  />
                  {errors.sku && <p className="text-xs sm:text-sm text-destructive">{errors.sku}</p>}
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for inventory tracking. Auto-generated if left empty.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="weight" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                      <Weight className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`bg-background border-border text-sm sm:text-base h-10 sm:h-11 ${errors.weight ? 'border-destructive' : ''}`}
                      disabled={isPending}
                    />
                    {errors.weight && <p className="text-xs sm:text-sm text-destructive">{errors.weight}</p>}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="dimensions" className="flex items-center text-xs sm:text-sm font-medium text-card-foreground">
                      <Ruler className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                      Dimensions
                    </Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="e.g., 10cm × 20cm × 5cm"
                      className="bg-background border-border text-sm sm:text-base h-10 sm:h-11"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="tags" className="text-xs sm:text-sm font-medium text-card-foreground">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., summer, cotton, casual (comma-separated)"
                    disabled={isPending}
                    className="bg-background border-border text-sm sm:text-base h-10 sm:h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add tags to help customers find your product. Separate with commas.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8 border-t-2 border-border/70">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearForm}
                disabled={isPending}
                className="bg-card border-2 border-border hover:bg-muted h-10 sm:h-11 lg:h-12 text-sm sm:text-base lg:text-lg px-6 lg:px-8 font-medium transition-all"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Clear Form
              </Button>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 lg:gap-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="bg-card border-2 border-border hover:bg-muted h-10 sm:h-11 lg:h-12 text-sm sm:text-base lg:text-lg px-6 lg:px-8 font-medium transition-all"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isPending}
                  className="min-w-full sm:min-w-[140px] lg:min-w-[180px] bg-primary text-primary-foreground hover:bg-primary/90 h-10 sm:h-11 lg:h-12 text-sm sm:text-base lg:text-lg font-semibold px-8 lg:px-12 shadow-lg hover:shadow-xl transition-all"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
