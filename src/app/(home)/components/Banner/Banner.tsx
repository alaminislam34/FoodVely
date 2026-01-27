import Link from "next/link";
import { Component } from "react";
import Products from "./Products";

export class Banner extends Component {
  render() {
    return (
      <div className="relative">
        <div className="absolute -top-20 -right-20 bg-white/50 max-w-xl w-full h-[50vh] rounded-bl-full -z-10"></div>
        <section className="py-12">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-Sofia font-bold leading-normal">
              Fresh, Local, <span className="text-rose-600">Delicious</span>{" "}
              <br /> The Future Table
            </h1>
            <p className="text-gray-500 py-2 md:max-w-3/4 lg:max-w-3/5">
              "Taste the Local Harvest in Every Bite." We don't just cook; we
              create. Our chefs hand-pick fresh, seasonal produce from local
              growers to bring you recipes that burst with authentic flavor. No
              preservatives, no shortcuts—just pure, chef-driven passion
              delivered to your sanctuary.
            </p>
            <div className="flex flex-row gap-4 items-center my-6">
              <Link
                href={"/account/signup"}
                className="py-3 px-8 hover:scale-105 rounded-2xl font-Sofia font-semibold border border-rose-600 bg-rose-500 hover:bg-rose-600 duration-300 hover:shadow text-white whitespace-nowrap"
              >
                Order Now
              </Link>
              <Link
                href={"/account/signin"}
                className="py-3 px-8 hover:scale-105 rounded-2xl font-Sofia font-semibold border border-rose-600 text-rose-600 hover:bg-rose-200 duration-300 hover:shadow whitespace-nowrap"
              >
                Explore more
              </Link>
            </div>
          </div>
          <Products />
        </section>
      </div>
    );
  }
}

export default Banner;
