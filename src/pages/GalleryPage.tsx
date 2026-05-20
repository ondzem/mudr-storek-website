import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Gallery items
const galleryItems = [
  {
    id: 1,
    title: 'Čekárna',
    description: 'Čekárna naší ordinace, vybavená stropním ventilátorem',
    thumbnail: 'https://i.imgur.com/7fxh30y.jpeg',
    fullImage: 'https://i.imgur.com/7fxh30y.jpeg',
    category: 'Ordinace'
  },
  {
    id: 2,
    title: 'Ordinace',
    description: 'Místo, kde se staráme o Vaše zdraví.',
    thumbnail: 'https://i.imgur.com/7cU4Y7Y.png',
    fullImage: 'https://i.imgur.com/7cU4Y7Y.png',
    category: 'Ordinace'
  },
  {
    id: 3,
    title: 'Sesterna',
    description: 'Recepce a sesterský pult',
    thumbnail: 'https://i.imgur.com/p9SBbKL.jpeg',
    fullImage: 'https://i.imgur.com/p9SBbKL.jpeg',
    category: 'Ordinace'
  },
  {
    id: 4,
    title: 'Vstup do ordinace',
    description: 'Vstupní dveře do naší ordinace',
    thumbnail: 'https://i.imgur.com/TpGdaFX.jpeg',
    fullImage: 'https://i.imgur.com/TpGdaFX.jpeg',
    category: 'Ordinace'
  },
  {
    id: 5,
    thumbnail: 'https://i.imgur.com/aDs9gBJ.jpeg',
    fullImage: 'https://i.imgur.com/aDs9gBJ.jpeg',
    category: 'Další fotky'
  },
  {
    id: 6,
    thumbnail: 'https://i.imgur.com/VASUTiC.jpeg',
    fullImage: 'https://i.imgur.com/VASUTiC.jpeg',
    category: 'Další fotky'
  },
  {
    id: 7,
    thumbnail: 'https://i.imgur.com/Sxx7K3o.jpeg',
    fullImage: 'https://i.imgur.com/Sxx7K3o.jpeg',
    category: 'Další fotky'
  },
  {
    id: 8,
    thumbnail: 'https://i.imgur.com/OwOKwVR.jpeg',
    fullImage: 'https://i.imgur.com/OwOKwVR.jpeg',
    category: 'Další fotky'
  },
  {
    id: 9,
    thumbnail: 'https://i.imgur.com/jX9tWNF.jpeg',
    fullImage: 'https://i.imgur.com/jX9tWNF.jpeg',
    category: 'Další fotky'
  },
  {
    id: 10,
    thumbnail: 'https://i.imgur.com/lGFxJUM.jpeg',
    fullImage: 'https://i.imgur.com/lGFxJUM.jpeg',
    category: 'Další fotky'
  },
  {
    id: 11,
    thumbnail: 'https://i.imgur.com/1eB73kF.jpeg',
    fullImage: 'https://i.imgur.com/1eB73kF.jpeg',
    category: 'Další fotky'
  },
  {
    id: 12,
    thumbnail: 'https://i.imgur.com/2r5PitF.jpeg',
    fullImage: 'https://i.imgur.com/2r5PitF.jpeg',
    category: 'Další fotky'
  },
];

// Get unique categories
const categories = ['Všechny', 'Ordinace', 'Další fotky'];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('Všechny');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = activeCategory === 'Všechny'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Fotogalerie | MUDr. Ludvík Štorek</title>
        <meta 
          name="description" 
          content="Prohlédněte si fotografie ordinace a vybavení MUDr. Ludvíka Štorka." 
        />
      </Helmet>

      {/* Header */}
      <section className="bg-primary-500 text-white py-12">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            Fotogalerie
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light"
          >
            Prohlédněte si naši ordinaci a vybavení
          </motion.p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section bg-white">
        <div className="container">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card overflow-hidden cursor-pointer h-full"
                onClick={() => setSelectedImage(item.id)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-4">
                  {item.title && <h3 className="font-semibold mb-1">{item.title}</h3>}
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image Modal */}
          <AnimatePresence>
            {selectedImage !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative max-w-4xl mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  {galleryItems.find(item => item.id === selectedImage) && (
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img
                        src={galleryItems.find(item => item.id === selectedImage)?.fullImage}
                        alt={galleryItems.find(item => item.id === selectedImage)?.title}
                        className="w-full max-h-[80vh] object-contain bg-black"
                      />
                      {(galleryItems.find(item => item.id === selectedImage)?.title || 
                        galleryItems.find(item => item.id === selectedImage)?.description) && (
                        <div className="p-4">
                          {galleryItems.find(item => item.id === selectedImage)?.title && (
                            <h3 className="text-xl font-semibold mb-2">
                              {galleryItems.find(item => item.id === selectedImage)?.title}
                            </h3>
                          )}
                          {galleryItems.find(item => item.id === selectedImage)?.description && (
                            <p className="text-gray-600">
                              {galleryItems.find(item => item.id === selectedImage)?.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default GalleryPage;