"use client";

import Banner from "./components/Banner/Banner";
import OurProducts from "./components/FoodsSection/OurProducts";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <section className="max-w-360 mx-auto w-11/12">
        <Banner />
        <OurProducts />
      </section>
    </div>
  );
}
