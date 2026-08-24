"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Star,
  Quote,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  MapPin,
  Building2,
  User,
  Filter,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_TESTIMONIALS, TestimonialItem } from "@/lib/cms/testimonials-service";
import { SafeImage } from "@/components/ui/safe-image";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<TestimonialItem>>({
    clientName: "",
    clientRole: "Vendor • Sold Property",
    rating: 5,
    quote: "",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    suburb: "Sydney, NSW",
    propertyAddress: "",
    agentName: "Elena Rostova",
    status: "PUBLISHED",
    featuredOnHome: true,
  });

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormData({
      clientName: "",
      clientRole: "Vendor • Sold Property",
      rating: 5,
      quote: "",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      suburb: "Sydney, NSW",
      propertyAddress: "",
      agentName: "Elena Rostova",
      status: "PUBLISHED",
      featuredOnHome: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.quote) return;

    if (editingItem) {
      // Update existing
      setItems(items.map((i) => (i.id === editingItem.id ? ({ ...i, ...formData } as TestimonialItem) : i)));
    } else {
      // Add new
      const newItem: TestimonialItem = {
        id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: formData.clientName || "Anonymous Client",
        clientRole: formData.clientRole || "Client",
        rating: Number(formData.rating) || 5,
        quote: formData.quote || "",
        avatarUrl: formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        suburb: formData.suburb || "Sydney, NSW",
        propertyAddress: formData.propertyAddress,
        agentName: formData.agentName,
        status: formData.status || "PUBLISHED",
        featuredOnHome: Boolean(formData.featuredOnHome),
        createdAt: new Date().toISOString(),
      };
      setItems([newItem, ...items]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this client review?")) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const toggleFeatured = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, featuredOnHome: !i.featuredOnHome } : i)));
  };

  const toggleStatus = (id: string) => {
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, status: i.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" } : i
      )
    );
  };

  const filteredItems = items.filter((item) => {
    if (statusFilter === "PUBLISHED" && item.status !== "PUBLISHED") return false;
    if (statusFilter === "FEATURED" && !item.featuredOnHome) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.clientName.toLowerCase().includes(term) ||
        item.suburb.toLowerCase().includes(term) ||
        item.quote.toLowerCase().includes(term) ||
        (item.agentName && item.agentName.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const totalPublished = items.filter((i) => i.status === "PUBLISHED").length;
  const totalFeatured = items.filter((i) => i.featuredOnHome).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/cms" className="text-xs font-medium text-slate-500 hover:text-slate-800">
              CMS Builder
            </Link>
            <span className="text-slate-400">/</span>
            <Badge variant="gold">Public Landing Page</Badge>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f] mt-1.5 flex items-center gap-3">
            <span>Client Testimonials &amp; Reviews Manager</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage vendor feedback, 5-star rating cards, and landing page client showcases.
          </p>
        </div>

        <Button variant="gold" size="lg" onClick={handleOpenAddForm} className="gap-2 text-xs font-bold shadow-md">
          <Plus className="h-4 w-4" />
          <span>Add New Client Review</span>
        </Button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Reviews</p>
          <p className="font-serif text-2xl font-bold text-[#0a192f]">{items.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Published Reviews</p>
          <p className="font-serif text-2xl font-bold text-emerald-600">{totalPublished}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Featured on Homepage</p>
          <p className="font-serif text-2xl font-bold text-[#c5a059]">{totalFeatured}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Average Rating</p>
          <p className="font-serif text-2xl font-bold text-amber-500 flex items-center gap-1">
            <span>5.0</span>
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </p>
        </div>
      </div>

      {/* Add / Edit Form Modal Card */}
      {isFormOpen && (
        <Card className="border-2 border-[#c5a059] bg-slate-900 text-white shadow-2xl animate-fadeIn">
          <CardHeader className="p-6 border-b border-slate-800 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif text-white">
              {editingItem ? "Edit Client Review" : "Add New Client Review"}
            </CardTitle>
            <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSaveItem} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label htmlFor="test-name" className="font-bold text-slate-300">Client Name *</label>
                  <input
                    id="test-name"
                    type="text"
                    required
                    value={formData.clientName || ""}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Harrison & Victoria Wells"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="test-role" className="font-bold text-slate-300">Client Role / Tag *</label>
                  <input
                    id="test-role"
                    type="text"
                    required
                    value={formData.clientRole || ""}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    placeholder="e.g. Vendors • Sold Waterfront Estate"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="test-rating" className="font-bold text-slate-300">Rating (1 to 5 Stars) *</label>
                  <select
                    id="test-rating"
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="test-suburb" className="font-bold text-slate-300">Suburb &amp; State *</label>
                  <input
                    id="test-suburb"
                    type="text"
                    required
                    value={formData.suburb || ""}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    placeholder="e.g. Mosman, NSW"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="test-address" className="font-bold text-slate-300">Property Address (Optional)</label>
                  <input
                    id="test-address"
                    type="text"
                    value={formData.propertyAddress || ""}
                    onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                    placeholder="e.g. 55 Bradleys Head Road, Mosman"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="test-agent" className="font-bold text-slate-300">Representing Agent</label>
                  <input
                    id="test-agent"
                    type="text"
                    value={formData.agentName || ""}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label htmlFor="test-quote" className="font-bold text-slate-300">Client Review &amp; Quote *</label>
                <textarea
                  id="test-quote"
                  required
                  rows={3}
                  value={formData.quote || ""}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Enter full client testimonial quote..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label htmlFor="test-avatar" className="font-bold text-slate-300">Avatar Image URL</label>
                  <input
                    id="test-avatar"
                    type="url"
                    value={formData.avatarUrl || ""}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.featuredOnHome || false}
                      onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                      className="rounded border-slate-700 text-[#c5a059] focus:ring-[#c5a059] h-4 w-4"
                    />
                    <span>Feature on Landing Page</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.status === "PUBLISHED"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "PUBLISHED" : "DRAFT" })}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="lg" className="text-xs font-bold">
                  {editingItem ? "Update Review" : "Publish Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials Table Card */}
      <Card className="border border-slate-200 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-base font-serif text-[#0a192f]">
            Client Testimonial Records ({filteredItems.length})
          </CardTitle>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                id="review-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, suburb..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              />
            </div>

            <select
              id="review-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Reviews</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="FEATURED">Featured on Home</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4">Client Info</th>
                  <th className="py-3 px-4">Rating &amp; Review Excerpt</th>
                  <th className="py-3 px-4">Suburb &amp; Agent</th>
                  <th className="py-3 px-4 text-center">Homepage Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={item.avatarUrl}
                          alt={item.clientName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          fallbackTitle={item.clientName[0]}
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.clientName}</p>
                          <p className="text-[10px] text-[#c5a059] font-medium">{item.clientRole}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-slate-600 line-clamp-2 text-[11px] italic">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800">{item.suburb}</p>
                        {item.agentName && (
                          <p className="text-[10px] text-slate-500">Agent: {item.agentName}</p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          item.featuredOnHome
                            ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {item.featuredOnHome ? "★ FEATURED" : "☆ OFF"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {item.status === "PUBLISHED" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> PUBLISHED
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" /> DRAFT
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditForm(item)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Edit Review"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete Review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
