"use client";

import Banner from "./components/Banner/Banner";
import FoodCategory from "./components/FoodsSection/FoodCategory";
import OurProducts from "./components/FoodsSection/OurProducts";
import PopularProvider from "./components/PopularProvider/PopularProvider";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <section className="max-w-360 mx-auto w-11/12">
        <Banner />
        <FoodCategory />
        <OurProducts />
        <PopularProvider />
      </section>
    </div>
  );
}
