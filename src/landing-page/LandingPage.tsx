import { FAQ } from "./components/FAQ";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Testimonials } from "./components/Testimonials";
import { faqs, features, footerNavigation, testimonials } from "./contentSections";
import { AIReady } from "./ExampleHighlightedFeature";

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="isolate">
        <Hero />
        <FeaturesGrid features={features} />
        <AIReady />
        <Testimonials testimonials={testimonials} />
        <FAQ faqs={faqs} />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
