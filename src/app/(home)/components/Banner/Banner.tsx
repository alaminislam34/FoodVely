import Link from "next/link";
import { Component } from "react";
import Products from "./Products";

export class Banner extends Component {
  render() {
    return (
      <div>
        <section className="py-12">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-Sofia font-bold leading-normal">
              Fresh, Local, <span className="text-rose-600">Delicious</span>{" "}
              <br /> The Future Table
            </h1>
            <p>
              Indulge in chef-crafted recipes made with fresh, local
              ingredients. Experience flavor delivered to your door.
            </p>
            <div className="flex flex-row gap-4 items-center mt-6">
              <Link
                href={"/account/signup"}
                className="py-2 px-6 rounded-2xl font-Sofia font-semibold border border-rose-600 bg-rose-500 hover:bg-rose-600 duration-300 hover:shadow text-white whitespace-nowrap"
              >
                Order Now
              </Link>
              <Link
                href={"/account/signin"}
                className="py-2 px-6 rounded-2xl font-Sofia font-semibold border border-rose-600 text-rose-600 hover:bg-rose-200 duration-300 hover:shadow whitespace-nowrap"
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
