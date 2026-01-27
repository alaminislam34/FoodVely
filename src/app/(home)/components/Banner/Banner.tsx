import { Component } from "react";

export class Banner extends Component {
  render() {
    return (
      <div>
        <section>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-Sofia font-extrabold leading-normal">
              Fresh, Local, Delicious <br /> The Future Table
            </h1>
            <p>
              Indulge in chef-crafted recipes made with fresh, local
              ingredients. Experience flavor delivered to your door.
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default Banner;
