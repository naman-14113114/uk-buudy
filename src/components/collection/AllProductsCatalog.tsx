"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShoppingBag, Star, Sparkles, ShieldCheck, Truck, Clock, RefreshCw } from "lucide-react";
import { products, type Product } from "@/data/products";
import { formatMoney, percentOff } from "@/lib/money";
import { useCart } from "@/components/cart/CartProvider";

type CategoryFilter = "all" | "devices" | "skincare" | "bundles" | "digital";
type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

function getProductCategory(product: Product): "devices" | "skincare" | "bundles" | "digital" {
  if (
    product.id === "buudy-led-mask" ||
    product.id === "buudy-red-light-torch" ||
    product.id === "buudy-ipl-device"
  ) {
    return "devices";
  }
  if (
    product.id === "the-ultimate-renewal-collection-box" ||
    product.id === "the-ultimate-hydration-duo" ||
    product.id === "anti-age-peptide-collection"
  ) {
    return "bundles";
  }
  if (product.id === "buudy-skincare-ebook" || product.id === "buudy-gift-card") {
    return "digital";
  }
  return "skincare";
}

function getCategorySubtitle(product: Product): string {
  const cat = getProductCategory(product);
  if (cat === "devices") {
    if (product.id === "buudy-led-mask") return "7-Colour Clinical Phototherapy";
    if (product.id === "buudy-red-light-torch") return "Targeted Red & NIR Spot Therapy";
    if (product.id === "buudy-ipl-device") return "Sapphire Ice Permanent IPL";
    return "Light Therapy Technology";
  }
  if (cat === "bundles") {
    return "Curated Treatment Set";
  }
  if (cat === "digital") {
    return "Digital & Gifting";
  }
  if (product.template === "cleanser") return "Botanical Balancing Cleanser";
  if (product.slug.includes("cream")) return "Multi-Peptide Dermal Care";
  return "Clinical Bioactive Serum";
}

export function AllProductsCatalog() {
  const { addProduct, openCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter out shipping protection & duplicates by id
  const catalogProducts = useMemo(() => {
    const seen = new Set<string>();
    const unique: Product[] = [];

    for (const p of products) {
      if (p.id === "buudy-package-protection") continue;
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    return unique;
  }, []);

  const counts = useMemo(() => {
    const res = { all: catalogProducts.length, devices: 0, skincare: 0, bundles: 0, digital: 0 };
    for (const p of catalogProducts) {
      const cat = getProductCategory(p);
      res[cat] = (res[cat] || 0) + 1;
    }
    return res;
  }, [catalogProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = catalogProducts.filter((product) => {
      if (selectedCategory === "all") return true;
      return getProductCategory(product) === selectedCategory;
    });

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "featured":
      default:
        // Keep canonical curated order
        break;
    }

    return list;
  }, [catalogProducts, selectedCategory, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1800);
    openCart();
  };

  return (
    <div className="bg-[var(--cream)] min-h-screen text-[var(--plum)]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20 border-b border-[rgba(46,16,47,0.08)] bg-gradient-to-b from-[#f8ede2] via-[var(--cream)] to-[var(--cream)]">
        <div className="buudy-wrap">
          <nav className="flex items-center gap-2 text-xs text-[var(--muted)] mb-6 buudy-mono tracking-widest uppercase">
            <Link href="/" className="hover:text-[var(--plum)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--gold)]">All Products</span>
          </nav>

          <div className="max-w-3xl">
            <p className="buudy-eyebrow text-xs md:text-sm mb-3">Clinical Phototherapy & Bioactive Formulations</p>
            <h1 className="buudy-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-[var(--plum)]">
              The Complete <em className="buudy-italic font-normal">Buudy Collection</em>
            </h1>
            <p className="buudy-copy text-sm sm:text-base md:text-lg mt-4 max-w-2xl text-[var(--muted)] leading-relaxed">
              Engineered to elevate your daily ritual. Explore our CE-certified LED therapy devices, targeted spot treatments, and clinically proven skincare formulations backed by independent science.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Sort Controls */}
      <section className="sticky top-0 z-20 bg-[var(--cream)]/95 backdrop-blur-md border-b border-[rgba(46,16,47,0.08)] py-3.5 transition-shadow">
        <div className="buudy-wrap flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {[
              { id: "all", label: "All Products", count: counts.all },
              { id: "devices", label: "Light Therapy", count: counts.devices },
              { id: "skincare", label: "Clinical Skincare", count: counts.skincare },
              { id: "bundles", label: "Sets & Bundles", count: counts.bundles },
              { id: "digital", label: "Digital & Gifts", count: counts.digital },
            ].map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-[var(--plum)] text-[var(--cream)] shadow-sm"
                      : "bg-white/80 text-[var(--plum)] border border-[rgba(46,16,47,0.1)] hover:border-[var(--gold)] hover:bg-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      active ? "bg-white/20 text-[var(--cream)]" : "bg-[rgba(46,16,47,0.06)] text-[var(--muted)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector & Product Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="text-[var(--muted)] buudy-mono tracking-wider uppercase text-[11px] hidden sm:inline">
              Showing {filteredAndSortedProducts.length} items
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort-select" className="text-[var(--muted)] buudy-mono uppercase text-[10px] tracking-wider">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-[rgba(46,16,47,0.12)] rounded-lg px-3 py-1.5 text-xs text-[var(--plum)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--gold)] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10 md:py-16">
        <div className="buudy-wrap">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(46,16,47,0.08)] p-8">
              <p className="text-lg text-[var(--plum)] font-semibold">No products found in this category.</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-4 px-6 py-2.5 rounded-full bg-[var(--plum)] text-[var(--cream)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--plum-soft)] transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
              {filteredAndSortedProducts.map((product, index) => {
                const discount = percentOff(product.priceCents, product.compareAtCents);
                const hasGifts = product.gifts && product.gifts.length > 0;
                const isBestSeller = product.id === "buudy-led-mask" || product.id === "buudy-peptide-ageless-am-pm-cream";
                const isAdded = addedProductId === product.id;
                const imageSrc = product.cartImage || product.gallery?.[0]?.src || "/images/placeholder.webp";
                const categorySubtitle = getCategorySubtitle(product);

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] overflow-hidden shadow-[0_2px_12px_rgba(46,16,47,0.03)] hover:shadow-[0_16px_36px_rgba(46,16,47,0.09)] hover:border-[rgba(184,149,86,0.4)] transition-all duration-300"
                  >
                    {/* Image Area */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-square w-full bg-[#fbf7f1] overflow-hidden flex items-center justify-center p-6 border-b border-[rgba(46,16,47,0.05)] cursor-pointer"
                    >
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-106"
                        priority={index < 4}
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none z-10">
                        {isBestSeller && (
                          <span className="bg-[var(--plum)] text-[var(--cream)] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm flex items-center gap-1">
                            <Sparkles size={10} className="text-[var(--gold)]" />
                            Best Seller
                          </span>
                        )}
                        {hasGifts && (
                          <span className="bg-[#8b2332] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                            3 Free Gifts
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="bg-[var(--gold)] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                            Save {discount}%
                          </span>
                        )}
                      </div>

                      {/* Rating Capsule Top Right */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-[rgba(46,16,47,0.08)] px-2 py-0.5 rounded-full text-[11px] font-semibold text-[var(--plum)] flex items-center gap-1 shadow-xs pointer-events-none z-10">
                        <Star size={11} className="fill-[var(--gold)] text-[var(--gold)]" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Subtitle / Category */}
                      <p className="buudy-mono text-[10px] text-[var(--gold)] font-medium tracking-[0.18em] uppercase mb-1.5">
                        {categorySubtitle}
                      </p>

                      {/* Product Title */}
                      <h2 className="buudy-display text-[17px] leading-snug font-semibold text-[var(--plum)] group-hover:text-[var(--gold)] transition-colors min-h-[2.75rem] line-clamp-2">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h2>

                      {/* Short Benefit / Active Highlight */}
                      <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed mt-1.5 mb-4 min-h-[2.25rem]">
                        {product.highlights?.[0] || product.shortDescription}
                      </p>

                      {/* Price & Action Row */}
                      <div className="mt-auto pt-3 border-t border-[rgba(46,16,47,0.06)] flex flex-col gap-3">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="buudy-display text-xl font-bold text-[var(--plum)]">
                              {product.priceCents === 0 ? "FREE" : formatMoney(product.priceCents, product.currency)}
                            </span>
                            {product.compareAtCents && product.compareAtCents > product.priceCents ? (
                              <span className="text-xs text-[var(--muted)] line-through">
                                {formatMoney(product.compareAtCents, product.currency)}
                              </span>
                            ) : null}
                          </div>

                          <span className="text-[11px] text-[var(--muted)]">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-[rgba(46,16,47,0.15)] text-[11px] font-semibold text-[var(--plum)] hover:border-[var(--plum)] hover:bg-[rgba(46,16,47,0.03)] transition-colors"
                          >
                            <span>Details</span>
                            <ArrowRight size={12} />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={isAdded}
                            className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm ${
                              isAdded
                                ? "bg-[var(--gold)] text-white"
                                : "bg-[var(--plum)] text-[var(--cream)] hover:bg-[var(--plum-soft)]"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={13} />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={13} />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Brand Value & Trust Guarantees */}
      <section className="border-t border-[rgba(46,16,47,0.08)] bg-[#f6ede2] py-14 md:py-18">
        <div className="buudy-wrap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--plum)] shadow-xs shrink-0">
                <Truck size={22} className="text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="buudy-display text-base font-semibold text-[var(--plum)]">Free UK Delivery</h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  Fast tracked Royal Mail dispatch across the United Kingdom on all qualified orders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--plum)] shadow-xs shrink-0">
                <ShieldCheck size={22} className="text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="buudy-display text-base font-semibold text-[var(--plum)]">30-Day In-Home Trial</h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  Try our phototherapy devices risk-free at home. Full refund if you don&apos;t love your results.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--plum)] shadow-xs shrink-0">
                <RefreshCw size={22} className="text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="buudy-display text-base font-semibold text-[var(--plum)]">Certified Formulations</h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  ISO 22716 GMP certified, clean vegan actives formulated without parabens or silicones.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--plum)] shadow-xs shrink-0">
                <Clock size={22} className="text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="buudy-display text-base font-semibold text-[var(--plum)]">Dedicated UK Support</h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  Our specialist skincare advisory team is here 7 days a week to support your ritual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
