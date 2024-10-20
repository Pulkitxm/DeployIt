"use client";

import { GetStartedButton } from "@/components/Home/getStartedButton";
import ProjectCarousel from "@/components/LandingPage/ProjectCarousel";
import { faqs, features, steps, whyChoseUs } from "@/lib/landing";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme } = useTheme();

  const themeColors = {
    light: {
      background: "bg-white",
      text: "text-gray-600",
      button: "bg-blue-600 text-white hover:bg-blue-700",
      card: "bg-white",
      border: "border-gray-200",
    },
    dark: {
      background: "bg-black",
      text: "text-gray-300",
      button: "bg-blue-500 text-white hover:bg-blue-600",
      card: "bg-gray-800",
      border: "border-gray-700",
    },
  };

  const currentTheme = themeColors[theme === "dark" ? "dark" : "light"];

  return (
    <>
      <main
        className={`space-y-32 px-4 py-16 sm:px-6 lg:px-8 ${currentTheme.background}`}
      >
        <section className="text-center">
          <h1
            className={`mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent ${theme === "dark" ? "dark:from-blue-400 dark:to-purple-400" : ""} md:text-6xl`}
          >
            Deploy Your React Projects with Ease
          </h1>
          <p className={`mb-8 text-xl ${currentTheme.text}`}>
            Streamline your deployment process, customize your project, and
            share with confidence.
          </p>
          <GetStartedButton />
        </section>

        <section className="text-center">
          <ProjectCarousel />
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${currentTheme.card}`}
            >
              <feature.icon
                className={`mb-4 h-12 w-12 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`}
              />
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className={currentTheme.text}>{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="text-center">
          <h2 className="mb-6 text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((item, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${currentTheme.card}`}
              >
                <div
                  className={`mb-4 text-3xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`}
                >
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className={currentTheme.text}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="mb-6 text-3xl font-bold">Why Choose DeployIt?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {whyChoseUs.map((feature, index) => (
              <div
                key={index}
                className={`flex items-start rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${currentTheme.card}`}
              >
                <feature.icon
                  className={`mr-4 mt-1 h-8 w-8 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`}
                />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className={currentTheme.text}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`border-t pt-16 ${currentTheme.border}`}>
          <h2 className="mb-6 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${currentTheme.card}`}
              >
                <h3 className="mb-2 text-xl font-semibold">{faq.question}</h3>
                <p className={currentTheme.text}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={`pb-12 pt-32 ${currentTheme.background}`}>
        <div
          className={`container mx-auto px-4 text-center ${currentTheme.text}`}
        >
          <p>&copy; 2023 DeployIt. All rights reserved.</p>
          <p className="mt-2">
            Made with ❤️ for React developers by
            <Link
              href="https://devpulkit.in"
              target="_blank"
              className={`ml-1 ${theme === "dark" ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"}`}
            >
              @pulkit
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
