import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import CTA from "../components/CTA";
import ServiceCategories from "../components/ServiceCategories";
import Notice from "../components/Notice";

function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Finderzz",
    image: "https://finderzz.com/og-image.jpg",
    url: "https://finderzz.com/",
    telephone: "+918262990986",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bhiwandi",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: "Bhiwandi",
    priceRange: "₹₹",
    description:
      "Trusted home services platform in Bhiwandi for plumbing, maid, painting, cleaning and inspection services.",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finderzz",
    url: "https://finderzz.com",
    logo: "https://finderzz.com/logo.png",
    sameAs: ["https://finderzz.com"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Finderzz",
    url: "https://finderzz.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://finderzz.com/services?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://finderzz.com/",
      },
    ],
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        {/* PRIMARY SEO */}
        <title>
          Home Services in Bhiwandi | Maid, Plumbing, Painting | Finderzz
        </title>

        <meta
          name="description"
          content="Book trusted home services in Bhiwandi with Finderzz. Hire verified plumbers, maids, painters, cleaners and inspection experts at affordable prices."
        />

        <meta
          name="keywords"
          content="home services Bhiwandi, plumber Bhiwandi, maid service Bhiwandi, painting service Bhiwandi, cleaning service Bhiwandi, Finderzz"
        />

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta name="author" content="Finderzz" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <link
          rel="canonical"
          href="https://finderzz.com/"
        />

        {/* OPEN GRAPH */}
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:site_name"
          content="Finderzz"
        />
        <meta
          property="og:title"
          content="Trusted Home Services in Bhiwandi | Finderzz"
        />
        <meta
          property="og:description"
          content="Book verified maids, plumbers, painters, cleaners and more in Bhiwandi."
        />
        <meta
          property="og:url"
          content="https://finderzz.com/"
        />
        <meta
          property="og:image"
          content="https://finderzz.com/og-image.jpg"
        />

        {/* TWITTER */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Trusted Home Services in Bhiwandi | Finderzz"
        />
        <meta
          name="twitter:description"
          content="Book professional home services in Bhiwandi instantly."
        />
        <meta
          name="twitter:image"
          content="https://finderzz.com/og-image.jpg"
        />

        {/* EXTRA INDEXING SIGNALS */}
        <meta
          httpEquiv="content-language"
          content="en-IN"
        />

        {/* STRUCTURED DATA */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Navbar />

      {/* H1 MUST EXIST FOR SEO */}
      <main>
        <section className="sr-only">
          <h1>
            Trusted Home Services in Bhiwandi - Maid, Plumbing, Painting &
            Cleaning
          </h1>

          <p>
            Finderzz provides verified home service professionals in Bhiwandi
            for maid services, plumbing, painting, cleaning, repairs and home
            inspections.
          </p>
        </section>

        <Hero />
        <Notice />
        <Stats />
        <ServiceCategories />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </>
  );
}

export default Home;