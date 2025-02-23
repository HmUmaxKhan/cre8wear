// src/app/page.js

import Categories from "@/components/home/Categories";
import CustomizationPreview from "@/components/home/CustomizationPreview";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import SocialProof from "@/components/home/SocialProof";
import Testimonials from "@/components/home/Testimonials";


export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <SocialProof />
    </main>
  );
}
