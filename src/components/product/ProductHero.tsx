import type { Product } from "@/data/products";
import { ProductGallery } from "./ProductGallery";
import { GiftBundle } from "./GiftBundle";

export function ProductHero({ product }: { product: Product }) {
  return (
    <section className="buudy-section bg-[var(--cream)] py-10 md:py-16">
      <div className="buudy-glow -left-20 -top-24 h-[500px] w-[500px] bg-[#f4a17b]" />
      <div className="buudy-glow -right-24 top-52 h-[560px] w-[560px] bg-[#a05080]" />
      <div className="buudy-wrap relative z-10 grid gap-8 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] md:items-start md:gap-8 xl:grid-cols-[1.05fr_1fr] xl:gap-16">
        <div className="md:sticky md:top-6 md:self-start">
          <ProductGallery images={product.gallery} hasGifts={product.gifts.length > 0} />
        </div>
        <GiftBundle product={product} />
      </div>
    </section>
  );
}
