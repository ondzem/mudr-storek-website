import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Building, ExternalLink, CreditCard, FileText, QrCode } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Kontakt | MUDr. Ludvík Štorek</title>
        <meta 
          name="description" 
          content="Kontaktní informace ordinace MUDr. Ludvíka Štorka - adresa, telefon, email a ordinační hodiny." 
        />
      </Helmet>

      {/* Header */}
      <section className="bg-primary-500 text-white text-align: center py-10">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-1 mt-1"
          >
            Kontaktní informace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light"
          >
          </motion.p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section bg-white">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:grid-flow-col">
            {/* Left column - Building Photo */}
            <div className="flex flex-col space-y-8 lg:row-span-2">
              {/* Building Photo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <div className="card overflow-hidden inline-block p-0">
                  <img
                    src="https://i.imgur.com/pJKmXtt.jpeg"
                    alt="Budova ordinace"
                    className="w-full object-cover"
                  />
                </div>
              </motion.div>
              
              {/* Office Hours */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block"
              >
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-6">
                      <Clock className="w-6 h-6 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold">Ordinační a provozní doba</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Pondělí</span>
                        <span>8:00 - 14:30</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Úterý</span>
                        <span>7:00 - 13:00</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Středa</span>
                        <span>13:00 - 18:30</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Čtvrtek</span>
                        <span>7:00 - 14:00</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="font-medium">Pátek</span>
                        <span>7:00 - 12:00</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-gray-600">
                        <strong>Akutní případy:</strong>  je vyhrazen čas na začátku ordinační doby
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Objednání:</strong> telefonicky nebo přes naše{' '}
                        <a href="/objednani" className="text-primary-500 hover:text-primary-600 font-medium">
                          online objednání
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column - Contact Info + Billing Info */}
            <div className="flex flex-col space-y-8">
              {/* Contact Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <MapPin className="w-6 h-6 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold">Kde nás najdete</h3>
                    </div>
                    <address className="not-italic space-y-2">
                      <p className="font-medium">Arnošta z Pardubic 2082</p>
                      <p>530 02 Pardubice</p>
                      <p>Česká republika</p>
                    </address>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                      <p className="text-gray-700">
                        Pro vstup do ordinace jděte vpravo od vchodových dveří okolo recepce do 1.patra, možno použít výtah, popř. bezbarierový přístup z boku budovy po dohodě s vrátným.
                      </p>
                    </div>
                    <a 
                      href="https://maps.google.com/?q=Arnošta+z+Pardubic+2082,+530+02+Pardubice" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-500 hover:text-primary-600 mt-4 text-sm font-medium"
                    >
                      Zobrazit na mapě
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>

                <div className="card mt-8">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <Phone className="w-6 h-6 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold">Kontaktujte nás</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Telefon</p>
                        <a 
                          href="tel:+420466030435" 
                          className="text-primary-500 hover:text-primary-600"
                        >
                          +420 466 030 435
                        </a>
                        <p className="text-sm text-gray-600 mt-1">Pro objednání a konzultace</p>
                      </div>
                      <div>
                        <p className="font-medium">E-mail</p>
                        <a 
                          href="mailto:mudr.storek@seznam.cz" 
                          className="text-primary-500 hover:text-primary-600"
                        >
                          mudr.storek@seznam.cz
                        </a>
                        <p className="text-sm text-gray-600 mt-1">Odpovídáme obvykle do 48 hodin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Billing information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <CreditCard className="w-6 h-6 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold">Fakturační údaje a platby</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">IČO</p>
                        <p className="font-medium">01051393</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">DIČ</p>
                        <p className="font-medium">CZ7108253141</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">IČP</p>
                        <p className="font-medium">65646001</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bankovní účet</p>
                        <p className="font-medium">107-3370180217/0100</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Způsoby platby:</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-primary-500 mr-2" />
                          <span>Hotovost</span>
                        </div>
                        <div className="flex items-center">
                          <QrCode className="w-5 h-5 text-primary-500 mr-2" />
                          <span>QR kód (aplikace Zaplať mi)</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-7 text-primary-500 mr-2" />
                          <span className="mr-2">Platební karty</span>
                          <span className="inline-flex items-center gap-2 ml-2">
                            <img src="https://i.imgur.com/pzkxwPg.png" alt="Visa" className="h-8" />
                            <img src="https://i.imgur.com/XROsimt.png" alt="Mastercard" className="h-8" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Office Hours - Mobile Only */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="block lg:hidden"
              >
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-6">
                      <Clock className="w-6 h-6 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold">Ordinační a provozní doba</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Pondělí</span>
                        <span>8:00 - 14:30</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Úterý</span>
                        <span>7:00 - 13:00</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Středa</span>
                        <span>13:00 - 18:30</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="font-medium">Čtvrtek</span>
                        <span>7:00 - 14:00</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="font-medium">Pátek</span>
                        <span>7:00 - 12:00</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-gray-600">
                        <strong>Akutní případy:</strong>  je vyhrazen čas na začátku ordinační doby
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Objednání:</strong> telefonicky nebo přes naše{' '}
                        <a href="/objednani" className="text-primary-500 hover:text-primary-600 font-medium">
                          online objednání
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section bg-gray-50">
        <div className="container max-w-5xl">
          <h2 className="text-center mb-8">Jak se k nám dostanete</h2>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
            <div className="card">
              <div className="card-body">
                <h4 className="font-semibold mb-3">MHD</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Trolejbus:</strong> č. 6, 8, 25, 88
                  </li>
                  <li>
                    <strong>Zastávka:</strong> Karla IV.
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h4 className="font-semibold mb-3">Parkování</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Parkování přímo před ordinací</li>
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h4 className="font-semibold mb-3">Orientační body</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Blízko Krajského úřadu</li>
                  <li>300m od zastávky MHD</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.7887927172037!2d15.770187899999999!3d50.0382897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470dc95560d35b39%3A0x67db26b0b366d928!2sArno%C5%A1ta%20z%20Pardubic%202082%2C%20530%2002%20Pardubice%2C%20%C4%8Cesko!5e0!3m2!1scs!2scz!4v1698837293251!5m2!1scs!2scz"
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa ordinace MUDr. Ludvík Štorek"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>
    
      {/* Need to make an appointment? */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center mb-6">Potřebujete se objednat?</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-8">
                Pro objednání k vyšetření můžete využít naše online objednávání, které je dostupné 24 hodin denně.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="/objednani" 
                  className="btn btn-primary"
                >
                  Online objednání
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;