import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-8xl font-bold text-primary-500 mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-6">Stránka nenalezena</h2>
            <p className="text-gray-600 mb-8">
              Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.
            </p>
            <Link to="/" className="btn btn-primary inline-flex items-center">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Zpět na úvodní stránku
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;