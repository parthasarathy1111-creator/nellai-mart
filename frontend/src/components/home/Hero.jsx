import Container from "../common/Container";
import SearchBar from "../common/SearchBar";
import { TYPOGRAPHY } from "../../styles/typography";

function Hero() {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <Container>

        <div className="max-w-3xl mx-auto text-center">

          <h1 className={TYPOGRAPHY.h1}>
            Find Products from Nearby Local Shops
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Search thousands of products available in your nearby stores.
          </p>

          <div className="mt-10">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <span className="rounded-full bg-green-100 px-4 py-2">
              Rice
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2">
              Milk
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2">
              Oil
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2">
              Vegetables
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2">
              Biscuits
            </span>

          </div>

        </div>

      </Container>
    </section>
  );
}

export default Hero;