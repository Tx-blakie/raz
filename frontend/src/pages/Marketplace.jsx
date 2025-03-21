import { useState } from 'react';
import { motion } from 'framer-motion';

const Marketplace = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "vegetables",
      price: 2.99,
      quantity: "1 kg",
      image: "https://images.unsplash.com/photo-1592924357220-5d57704e3810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      farmer: "Green Valley Farms",
      location: "California"
    },
    {
      id: 2,
      name: "Fresh Apples",
      category: "fruits",
      price: 3.49,
      quantity: "1 kg",
      image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      farmer: "Sunny Orchards",
      location: "Washington"
    },
    {
      id: 3,
      name: "Brown Rice",
      category: "grains",
      price: 4.99,
      quantity: "2 kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      farmer: "Rice Fields Co.",
      location: "Arkansas"
    },
    {
      id: 4,
      name: "Fresh Carrots",
      category: "vegetables",
      price: 1.99,
      quantity: "500 g",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      farmer: "Organic Roots",
      location: "Oregon"
    },
    {
      id: 5,
      name: "Avocados",
      category: "fruits",
      price: 6.99,
      quantity: "4 pcs",
      image: "https://images.unsplash.com/photo-1601039641847-7857b994d704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      farmer: "Green Earth Farms",
      location: "Mexico"
    },
    {
      id: 6,
      name: "Whole Wheat Flour",
      category: "grains",
      price: 3.29,
      quantity: "1 kg",
      image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      farmer: "Golden Wheat Co.",
      location: "Kansas"
    },
    {
      id: 7,
      name: "Fresh Broccoli",
      category: "vegetables",
      price: 2.49,
      quantity: "500 g",
      image: "https://images.unsplash.com/photo-1614336215203-05a588f74627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      farmer: "Valley Fresh Produce",
      location: "California"
    },
    {
      id: 8,
      name: "Strawberries",
      category: "fruits",
      price: 4.99,
      quantity: "250 g",
      image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      farmer: "Berry Good Farms",
      location: "Florida"
    }
  ];
  
  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-green-700 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
            alt="Marketplace background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Agricultural Marketplace</h1>
            <p className="text-xl mb-8">
              Connect directly with farmers and source fresh, high-quality produce at fair prices
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for products, farmers, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-5 pl-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {['all', 'vegetables', 'fruits', 'grains'].map(category => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === category 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} variants={itemVariants} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Are you a farmer?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our platform to list your products and connect directly with buyers across the country.
            </p>
            <motion.a 
              href="/register?type=farmer" 
              className="inline-block px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register as a Farmer
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, variants }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      variants={variants}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-52 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 py-1 px-3 rounded-full text-sm font-medium text-green-700">
          ${product.price}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{product.quantity}</span>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">{product.farmer}</p>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {product.location}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-green-600 font-medium capitalize">{product.category}</span>
          </div>
          <motion.button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Marketplace; 