
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="pt-16">
      <Hero />
      <FeaturedProducts />
      
      {/* Categories Section */}
      <section className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} transition-colors duration-200`}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-sm bg-primary/30 text-white px-2 py-1 rounded font-medium">Explore Categories</span>
            <h2 className={`heading-lg mt-2 ${theme === "dark" ? "text-white" : ""}`}>Shop By Category</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Furniture",
                image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                count: 24
              },
              {
                title: "Lighting",
                image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                count: 18
              },
              {
                title: "Decor",
                image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                count: 32
              }
            ].map((category, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{category.title}</h3>
                  <p className="text-sm opacity-90">{category.count} Products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner Section */}
      <section className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"} transition-colors duration-200`}>
        <div className="container">
          <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <h2 className="heading-lg mb-4">Summer Sale</h2>
                <p className="text-lg text-white/80 max-w-md">
                  Enjoy up to 40% off on selected items. Limited time offer.
                </p>
              </div>
              
              <a 
                href="/products" 
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 font-medium text-primary shadow transition-transform hover:bg-white/90 hover:scale-105 active:scale-100"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} transition-colors duration-200`}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-sm bg-primary/30 text-white px-2 py-1 rounded font-medium">Testimonials</span>
            <h2 className={`heading-lg mt-2 ${theme === "dark" ? "text-white" : ""}`}>What Our Customers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The quality of their products is exceptional. Minimal design with maximum comfort.",
                author: "Emily Johnson",
                role: "Interior Designer"
              },
              {
                text: "Fast delivery and the products look even better in person. Highly recommend!",
                author: "Michael Chen",
                role: "Architect"
              },
              {
                text: "Their customer service is as impressive as their product quality. A brand I trust.",
                author: "Sarah Williams",
                role: "Home Decorator"
              }
            ].map((testimonial, index) => (
              <div key={index} className={`${theme === "dark" ? "bg-gray-700" : "bg-white"} p-6 rounded-lg shadow-sm transition-colors duration-200`}>
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-muted-foreground"}`}>"{testimonial.text}"</p>
                <div>
                  <p className={`font-medium ${theme === "dark" ? "text-white" : ""}`}>{testimonial.author}</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"} transition-colors duration-200`}>
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className={`heading-md mb-4 ${theme === "dark" ? "text-white" : ""}`}>Subscribe to Our Newsletter</h2>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-muted-foreground"} mb-6`}>
              Stay updated with our newest products and exclusive offers.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex h-10 w-full rounded-md border ${theme === "dark" ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400" : "border-input bg-transparent"} px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                required
              />
              <button 
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
