'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
  isActive?: boolean;
}

export default function CarouselManagement() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
  });

  // Fetch carousel items
  useEffect(() => {
    const fetchInitialItems = async () => {
      try {
        const response = await fetch('/api/admin/carousel');
        if (response.ok) {
          const data = await response.json();
          // Filter to show only active items
          const activeItems = data.items.filter((item: CarouselItem) => item.isActive !== false);
          setItems(activeItems);
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error);
        toast.error('Failed to load carousel items');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialItems();
  }, []);

  const handleAdd = async () => {
    if (!formData.image || !formData.title) {
      toast.error('Image and title are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cloudinaryPublicId: uploadMode === 'file' ? formData.image : '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems([...items, data.item]);
        setFormData({ image: '', title: '', description: '' });
        setUploadMode('file');
        toast.success('Carousel item added successfully');
        // Clear preview if it exists
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add carousel item');
      }
    } catch (error) {
      console.error('Error adding carousel item:', error);
      toast.error('Failed to add carousel item');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.image || !formData.title) {
      toast.error('Image and title are required');
      return;
    }

    try {
      const response = await fetch(`/api/admin/carousel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cloudinaryPublicId: uploadMode === 'file' ? formData.image : '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems(items.map((item) => (item.id === id ? data.item : item)));
        setEditingId(null);
        setFormData({ image: '', title: '', description: '' });
        setUploadMode('file');
        toast.success('Carousel item updated successfully');
        // Clear preview if it exists
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update carousel item');
      }
    } catch (error) {
      console.error('Error updating carousel item:', error);
      toast.error('Failed to update carousel item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this carousel item?')) return;

    try {
      const response = await fetch(`/api/admin/carousel/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from frontend immediately
        setItems(items.filter((item) => item.id !== id));
        toast.success('Carousel item deleted successfully');
        // Refresh the list to ensure sync with database
        setTimeout(() => {
          fetchItems();
        }, 500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete carousel item');
      }
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      toast.error('Failed to delete carousel item');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/carousel');
      if (response.ok) {
        const data = await response.json();
        // Filter to show only active items in admin view
        const activeItems = data.items.filter((item: CarouselItem) => item.isActive !== false);
        setItems(activeItems);
      }
    } catch (error) {
      console.error('Error fetching carousel items:', error);
    }
  };

  const handleEdit = (item: CarouselItem) => {
    setEditingId(item.id);
    setFormData({
      image: item.image,
      title: item.title,
      description: item.description,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ image: '', title: '', description: '' });
    setUploadMode('file');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image: data.url });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Carousel Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage the carousel images displayed on the products page
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Carousel Item' : 'Add New Carousel Item'}</CardTitle>
          <CardDescription>
            {editingId
              ? 'Update the carousel item details'
              : 'Add a new image to the carousel'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={uploadMode === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMode('file')}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <Button
              variant={uploadMode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMode('url')}
              className="gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              URL
            </Button>
          </div>

          {uploadMode === 'file' ? (
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              {uploading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
          )}

          {formData.image && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className="w-full h-40 bg-muted rounded-lg overflow-hidden relative">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    toast.error('Failed to load image preview');
                    setFormData({ ...formData, image: '' });
                  }}
                />
                {uploadMode === 'file' && (
                  <button
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              placeholder="e.g., Discover Local Products"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              placeholder="e.g., Shop from verified local sellers near you"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <>
                <Button
                  onClick={() => handleUpdate(editingId)}
                  className="flex-1"
                >
                  Update Item
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="flex-1 gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Carousel Items List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Carousel Items</h2>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>📊 Total Items: <span className="font-semibold text-foreground">{items.length}</span></span>
              <span>✅ Active: <span className="font-semibold text-foreground">{items.filter(i => i.isActive !== false).length}</span></span>
            </div>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading carousel items...</p>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No carousel items yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first carousel item above
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="w-full h-40 bg-muted overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
