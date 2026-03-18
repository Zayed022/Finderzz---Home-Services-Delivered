export default function CTA() {
    return (
      <section className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] py-16 md:py-20 text-center text-white">
        <div className="max-w-3xl mx-auto px-6">
  
          {/* HEADING */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
  
          {/* SUBTEXT */}
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Join thousands of happy customers in Bhiwandi. Book your first service today.
          </p>
  
          {/* BUTTON */}
          <button className="border border-white text-white px-8 py-3 rounded-xl text-lg font-medium flex items-center gap-2 mx-auto hover:bg-white hover:text-[#0077B6] transition-all duration-300">
            Book a Service
            <span className="text-xl">→</span>
          </button>
  
        </div>
      </section>
    );
  }