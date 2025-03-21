import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
            alt="Agricultural services" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Agricultural Services</h1>
            <p className="text-xl mb-8">
              Comprehensive solutions to support farmers, buyers, and agricultural helpers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🌱",
                title: "Crop Planning",
                description: "Get expert advice on crop selection, rotation planning, and optimal planting schedules based on your location and soil conditions.",
                color: "bg-green-50 border-green-200",
                iconColor: "bg-green-100 text-green-600"
              },
              {
                icon: "🚜",
                title: "Equipment Rental",
                description: "Access modern farming equipment without the high cost of ownership. Rent what you need, when you need it.",
                color: "bg-blue-50 border-blue-200",
                iconColor: "bg-blue-100 text-blue-600"
              },
              {
                icon: "📊",
                title: "Market Analysis",
                description: "Stay informed with the latest market trends, pricing information, and demand forecasts for your agricultural products.",
                color: "bg-purple-50 border-purple-200",
                iconColor: "bg-purple-100 text-purple-600"
              },
              {
                icon: "👨‍🌾",
                title: "Labor Connection",
                description: "Find skilled agricultural workers for seasonal help, or offer your expertise to farmers in need of assistance.",
                color: "bg-amber-50 border-amber-200",
                iconColor: "bg-amber-100 text-amber-600"
              },
              {
                icon: "🧪",
                title: "Soil Testing",
                description: "Comprehensive soil analysis to determine nutrient levels, pH balance, and recommendations for soil improvement.",
                color: "bg-red-50 border-red-200",
                iconColor: "bg-red-100 text-red-600"
              },
              {
                icon: "📱",
                title: "Smart Farming",
                description: "Implement IoT and data-driven solutions to optimize irrigation, monitor crop health, and automate farm processes.",
                color: "bg-teal-50 border-teal-200",
                iconColor: "bg-teal-100 text-teal-600"
              }
            ].map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden border p-6 ${service.color} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start mb-4">
                  <div className={`rounded-full p-3 mr-4 ${service.iconColor} text-2xl`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-green-600 font-medium hover:underline flex items-center"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Membership Benefits</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Enhance your agricultural journey with our premium services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Basic",
                price: "$0",
                period: "Forever Free",
                featured: false,
                features: [
                  "✅ Basic marketplace access",
                  "✅ Public profile listing",
                  "✅ Connect with 5 users per month",
                  "❌ Premium market insights",
                  "❌ Priority support",
                  "❌ Featured listings"
                ],
                buttonText: "Current Plan"
              },
              {
                title: "Pro",
                price: "$29",
                period: "per month",
                featured: true,
                features: [
                  "✅ Full marketplace access",
                  "✅ Enhanced profile with media",
                  "✅ Unlimited connections",
                  "✅ Weekly market insights",
                  "✅ Priority support",
                  "✅ 3 featured listings per month"
                ],
                buttonText: "Upgrade to Pro"
              },
              {
                title: "Enterprise",
                price: "$99",
                period: "per month",
                featured: false,
                features: [
                  "✅ Everything in Pro",
                  "✅ Custom branding",
                  "✅ API access",
                  "✅ Daily market insights",
                  "✅ Dedicated account manager",
                  "✅ Unlimited featured listings"
                ],
                buttonText: "Contact Sales"
              }
            ].map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden ${
                  plan.featured 
                    ? 'bg-gradient-to-b from-green-50 to-white border-2 border-green-500 shadow-lg transform scale-105' 
                    : 'bg-white border border-gray-200'
                } hover:shadow-xl transition-all duration-300`}
              >
                {plan.featured && (
                  <div className="bg-green-500 text-white py-1 text-center text-sm font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <p key={i} className="text-gray-600">
                        {feature}
                      </p>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg font-medium ${
                      plan.featured 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors duration-300`}
                  >
                    {plan.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from the farmers and businesses that have transformed their operations with our services
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-green-50 rounded-2xl p-8 md:p-12 relative"
          >
            <div className="text-5xl text-green-200 absolute top-8 left-8">"</div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <p className="text-xl md:text-2xl text-gray-800 italic mb-8">
                The soil testing and crop planning services have completely transformed my farm's productivity. 
                We've seen a 40% increase in yield and significantly reduced our use of fertilizers by applying 
                exactly what our soil needed. The return on investment has been remarkable.
              </p>
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Client" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Robert Johnson</h4>
                  <p className="text-green-600">Organic Farmer, California</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 md:mb-0 md:mr-8"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Agricultural Operations?</h2>
              <p className="text-xl text-green-100 max-w-2xl">
                Join thousands of satisfied clients who have transformed their farming with our services
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/register" 
                className="inline-block px-8 py-4 bg-white text-green-700 font-bold rounded-lg shadow-md hover:bg-green-50 transition-colors duration-300"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 