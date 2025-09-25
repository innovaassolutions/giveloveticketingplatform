'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Settings, Save, X } from 'lucide-react';
import { useMerchandise, MerchandiseItem } from '../../contexts/MerchandiseContext';
import { useUnifiedCart } from '../../contexts/UnifiedCartContext';

const initialMerchandiseItems: MerchandiseItem[] = [
  {
    id: 'tshirt-giveback-logo',
    name: 'GiveLove Logo T-Shirt',
    description: 'Soft cotton t-shirt with embroidered GiveLove logo. Proceeds support music education.',
    price: 28.00,
    image: '/images/merch/tshirt-giveback-logo.jpg',
    category: 'apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Forest Green']
  },
  {
    id: 'hoodie-fair-tickets',
    name: 'Fair Tickets Real Impact Hoodie',
    description: 'Premium fleece hoodie with our signature slogan. Perfect for concerts and charity events.',
    price: 52.00,
    image: '/images/merch/hoodie-fair-tickets.jpg',
    category: 'apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Burgundy', 'Purple']
  },
  {
    id: 'tote-bag-sustainable',
    name: 'Sustainable Canvas Tote',
    description: 'Eco-friendly canvas tote bag made from recycled materials. Carry your values.',
    price: 18.00,
    image: '/images/merch/tote-bag-sustainable.jpg',
    category: 'accessories',
    colors: ['Natural', 'Black', 'Navy']
  },
  {
    id: 'water-bottle-stainless',
    name: 'GiveLove Stainless Water Bottle',
    description: 'Insulated stainless steel water bottle. Stay hydrated while making a difference.',
    price: 24.00,
    image: '/images/merch/water-bottle-stainless.jpg',
    category: 'accessories',
    colors: ['Silver', 'Matte Black', 'Rose Gold']
  },
  {
    id: 'cap-embroidered',
    name: 'Embroidered Logo Cap',
    description: 'Classic baseball cap with subtle GiveBack embroidery. Adjustable fit.',
    price: 22.00,
    image: '/images/merch/cap-embroidered.jpg',
    category: 'accessories',
    colors: ['Black', 'Navy', 'Khaki', 'White']
  },
  {
    id: 'vinyl-compilation',
    name: 'Charity Concert Series Vinyl',
    description: 'Limited edition vinyl featuring tracks from our charity concerts. Collectible artwork.',
    price: 35.00,
    image: '/images/merch/vinyl-compilation.jpg',
    category: 'collectibles'
  },
  {
    id: 'pin-set-artists',
    name: 'Artist Collaboration Pin Set',
    description: 'Enamel pin set featuring designs from our partner artists. Limited quantities.',
    price: 15.00,
    image: '/images/merch/pin-set-artists.jpg',
    category: 'collectibles'
  },
  {
    id: 'notebook-impact',
    name: 'Impact Journal',
    description: 'Lined notebook to track your charitable giving and concert memories.',
    price: 12.00,
    image: '/images/merch/notebook-impact.jpg',
    category: 'accessories',
    colors: ['Sage', 'Terracotta', 'Navy']
  }
];

export default function ShopPage() {
  const { addToCart } = useMerchandise();
  const { addMerchandiseToCart, getCartItemCount } = useUnifiedCart();
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingItem, setEditingItem] = useState<MerchandiseItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MerchandiseItem>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'apparel',
    sizes: [],
    colors: []
  });

  // Load merchandise from API on component mount
  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
      const response = await fetch('/api/merchandise');
      if (response.ok) {
        const items = await response.json();
        setMerchandiseItems(items);
      } else {
        console.error('Failed to fetch merchandise');
        // Fallback to initial data if API fails
        setMerchandiseItems(initialMerchandiseItems);
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      // Fallback to initial data if API fails
      setMerchandiseItems(initialMerchandiseItems);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'collectibles', name: 'Collectibles' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? merchandiseItems
    : merchandiseItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MerchandiseItem) => {
    if (item.sizes && !selectedSize) {
      setSelectedItem(item);
      return;
    }

    // Add to both legacy cart and unified cart
    addToCart(item, quantity, selectedSize || undefined, selectedColor || undefined);
    addMerchandiseToCart(item, quantity, selectedSize || undefined, selectedColor || undefined);
    setSelectedItem(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const handleQuickAdd = () => {
    if (selectedItem) {
      // Add to both legacy cart and unified cart
      addToCart(selectedItem, quantity, selectedSize || undefined, selectedColor || undefined);
      addMerchandiseToCart(selectedItem, quantity, selectedSize || undefined, selectedColor || undefined);
      setSelectedItem(null);
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
    }
  };

  // Admin functions
  const handleAddItem = async () => {
    if (newItem.name && newItem.description && newItem.price && newItem.image && newItem.category) {
      try {
        const response = await fetch('/api/merchandise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newItem.name,
            description: newItem.description,
            price: newItem.price,
            image: newItem.image,
            category: newItem.category,
            sizes: newItem.sizes || [],
            colors: newItem.colors || []
          }),
        });

        if (response.ok) {
          const addedItem = await response.json();
          setMerchandiseItems([...merchandiseItems, addedItem]);
          setNewItem({
            name: '',
            description: '',
            price: 0,
            image: '',
            category: 'apparel',
            sizes: [],
            colors: []
          });
          setShowAddForm(false);
        } else {
          console.error('Failed to add item');
          alert('Failed to add item. Please try again.');
        }
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item. Please try again.');
      }
    }
  };

  const handleEditItem = (item: MerchandiseItem) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddForm(true);
  };

  const handleUpdateItem = async () => {
    if (editingItem && newItem.name && newItem.description && newItem.price && newItem.image && newItem.category) {
      try {
        const response = await fetch('/api/merchandise', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingItem.id,
            name: newItem.name,
            description: newItem.description,
            price: newItem.price,
            image: newItem.image,
            category: newItem.category,
            sizes: newItem.sizes || [],
            colors: newItem.colors || []
          }),
        });

        if (response.ok) {
          const updatedItem = await response.json();
          const updatedItems = merchandiseItems.map(item =>
            item.id === editingItem.id ? updatedItem : item
          );
          setMerchandiseItems(updatedItems);
          setEditingItem(null);
          setNewItem({
            name: '',
            description: '',
            price: 0,
            image: '',
            category: 'apparel',
            sizes: [],
            colors: []
          });
          setShowAddForm(false);
        } else {
          console.error('Failed to update item');
          alert('Failed to update item. Please try again.');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item. Please try again.');
      }
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/merchandise?id=${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMerchandiseItems(merchandiseItems.filter(item => item.id !== itemId));
        } else {
          console.error('Failed to delete item');
          alert('Failed to delete item. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'apparel',
      sizes: [],
      colors: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  ← Events
                </Link>
                <span className="text-white/30">|</span>
                <span className="text-white font-medium">Shop</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">GiveLove Shop</h1>
                <p className="text-white/70">Merchandise that makes a difference</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                  isAdminMode
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                {isAdminMode ? 'Exit Admin' : 'Admin'}
              </button>
              <Link
                href="/checkout"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                Cart ({getCartItemCount()})
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Event Tickets Promotion */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-2xl p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">🎫 Don't Forget Event Tickets!</h2>
              <p className="text-white/80 mb-4">
                Complete your experience - browse upcoming events and add tickets to your cart
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-primary font-semibold">Lady Gaga</div>
                  <div className="text-white/60 text-sm">One Night in KL</div>
                  <div className="text-white/60 text-sm">From $125</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-primary font-semibold">Taylor Swift</div>
                  <div className="text-white/60 text-sm">Eras Tour</div>
                  <div className="text-white/60 text-sm">From $150</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-primary font-semibold">Dolly Parton</div>
                  <div className="text-white/60 text-sm">Country Legends</div>
                  <div className="text-white/60 text-sm">From $95</div>
                </div>
              </div>
              <Link
                href="/"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl transition-colors font-medium shadow-lg"
              >
                Browse Events & Add Tickets →
              </Link>
              <p className="text-xs text-white/50 mt-2">
                Tickets will be added to your current cart for combined checkout
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter & Admin Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {isAdminMode && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-lg">Loading merchandise...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all group"
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <div className="flex gap-1">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      ${item.price.toFixed(2)}
                    </span>
                    {isAdminMode && (
                      <>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-white mb-2">{item.name}</h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{item.description}</p>

                {item.colors && (
                  <div className="mb-3">
                    <span className="text-white/60 text-xs">Available in: {item.colors.join(', ')}</span>
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl transition-all font-medium"
                >
                  {item.sizes ? 'Select Options' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Product Selection Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">{selectedItem.name}</h3>

              {selectedItem.sizes && (
                <div className="mb-4">
                  <label className="block text-white/70 mb-2">Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedItem.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.colors && (
                <div className="mb-4">
                  <label className="block text-white/70 mb-2">Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`py-2 px-3 rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-white/70 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20"
                  >
                    -
                  </button>
                  <span className="text-white font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickAdd}
                  disabled={selectedItem.sizes && !selectedSize}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add/Edit Item Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-white/70 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/70 mb-2">Description</label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 h-24 resize-none"
                    placeholder="Enter item description"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-white/70 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-white/70 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newItem.image || ''}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="/images/merch/item-name.jpg"
                  />
                  <p className="text-white/50 text-sm mt-1">
                    Use path format: /images/merch/filename.jpg
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white/70 mb-2">Category</label>
                  <select
                    value={newItem.category || 'apparel'}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as 'apparel' | 'accessories' | 'collectibles' })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="apparel">Apparel</option>
                    <option value="accessories">Accessories</option>
                    <option value="collectibles">Collectibles</option>
                  </select>
                </div>

                {/* Sizes (for apparel) */}
                {newItem.category === 'apparel' && (
                  <div>
                    <label className="block text-white/70 mb-2">Available Sizes</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <label key={size} className="flex items-center gap-2 text-white/80">
                          <input
                            type="checkbox"
                            checked={newItem.sizes?.includes(size) || false}
                            onChange={(e) => {
                              const sizes = newItem.sizes || [];
                              if (e.target.checked) {
                                setNewItem({ ...newItem, sizes: [...sizes, size] });
                              } else {
                                setNewItem({ ...newItem, sizes: sizes.filter(s => s !== size) });
                              }
                            }}
                            className="rounded"
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                <div>
                  <label className="block text-white/70 mb-2">Available Colors</label>
                  <input
                    type="text"
                    value={newItem.colors?.join(', ') || ''}
                    onChange={(e) => setNewItem({ ...newItem, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="Black, White, Navy (comma separated)"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}