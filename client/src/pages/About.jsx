import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Logo from "../components/Logo"
import Transition from "../components/Transition"

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-10 items-center my-auto w-11/12 md:w-3/4 mx-auto mt-20">
        <Transition>
          <section className="mb-12 mt-5 shadow-lg p-5 rounded-md">
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Words from the Founder
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed italic">
              "Cooking is like love—it should be entered into with abandon or
              not at all."
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Hi there! I'm{" "}
              <span className="font-bold text-primary ">Saurav Karki</span>,{" "}
              <span className="font-bold text-secondary ">the founder</span> of{" "}
              {<Logo />} . When I started this journey, I had one simple goal:
              to bring people together through the joy of cooking. Whether
              you're burning toast or mastering the art of soufflé, MakeHub is
              here to make your culinary adventures just a little bit easier—and
              a whole lot more fun.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Remember, in the kitchen, there are no mistakes—only delicious
              experiments waiting to happen. So grab your apron, turn up the
              heat, and let's make something amazing together!
            </p>
            <p>
              Journey Started as the founder
              <span className="font-bold text-secondary ">
                {" "}
                2024 August 10.
              </span>
            </p>
          </section>
        </Transition>

        <Transition>
          <section className="mb-12 shadow-lg p-5 rounded-md">
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At MakeHub, we believe that cooking is more than just preparing
              meals—it's an art, a passion, and a way to connect with others.
              Our mission is to create a vibrant community where culinary
              enthusiasts, from home cooks to professional chefs, can share
              their love for food, explore new recipes, and inspire each other
              to try something new in the kitchen.
            </p>
          </section>
        </Transition>

        <Transition>
          <section className="mb-12 shadow-lg p-5 rounded-md">
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed">
              <li>
                <strong>Discover Recipes:</strong> Browse through a vast
                collection of recipes curated from around the world. Whether
                you're looking for quick weeknight dinners, indulgent desserts,
                or healthy meals, MakeHub has something for everyone.
              </li>
              <li>
                <strong>Share Your Creations:</strong> Have a recipe that
                everyone loves? Share it with the MakeHub community! Upload your
                recipes, add photos, and let others enjoy your culinary
                creations.
              </li>
              <li>
                <strong>Connect with Others:</strong> Follow your favorite
                chefs, interact with fellow food lovers, and build your own
                network of culinary inspiration. At MakeHub, we're all about
                community and collaboration.
              </li>
              <li>
                <strong>Save Your Favorites:</strong> Keep track of the recipes
                you love by saving them to your personal collection. Whether
                it's a dish you want to try later or a recipe you've perfected,
                your saved recipes are always just a click away.
              </li>
            </ul>
          </section>
        </Transition>

        <Transition>
          <section className="mb-12 shadow-lg p-5 rounded-md">
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Why Choose MakeHub?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              MakeHub stands out for its user-friendly design, curated content,
              and emphasis on community. We understand that cooking is a
              personal journey, and we aim to provide a platform that supports
              your culinary adventures, whether you're a seasoned chef or just
              starting out.
            </p>
          </section>
        </Transition>

        <Transition>
          <section className="shadow-lg p-5 rounded-md">
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Join Us Today
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Become a part of MakeHub and start your culinary journey with us.
              Explore, create, share, and connect—let's make something delicious
              together!
            </p>
          </section>
        </Transition>
      </div>
      <Footer />
    </div>
  )
}

export default About
