import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Scale, Calendar, CreditCard, UserCheck, AlertTriangle, Phone, Shield, CheckCircle } from 'lucide-react';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Podmínky zdravotních služeb | MUDr. Ludvík Štorek</title>
        <meta 
          name="description" 
          content="Podmínky zdravotních služeb ordinace MUDr. Ludvíka Štorka." 
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
            Podmínky zdravotních služeb
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light"
          >
            Podmínky poskytování zdravotních služeb
          </motion.p>
        </div>
      </section>

      {/* Mobile Quick Navigation */}
      <div className="sticky top-16 z-20 bg-white shadow-md py-3 md:hidden">
        <div className="flex space-x-4 overflow-x-auto px-4 no-scrollbar">
          <a href="#section1" className="whitespace-nowrap px-3 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg flex-shrink-0">
            Úvod
          </a>
          <a href="#section2" className="whitespace-nowrap px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex-shrink-0">
            Poskytování péče
          </a>
          <a href="#section3" className="whitespace-nowrap px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex-shrink-0">
            Objednávání
          </a>
          <a href="#section4" className="whitespace-nowrap px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex-shrink-0">
            Platby
          </a>
        </div>
      </div>

      <section className="section bg-white">
        <div className="container max-w-6xl">
          <div className="prose prose-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="lead text-lg">
                Tyto podmínky upravují vzájemná práva a povinnosti mezi poskytovatelem zdravotních služeb, MUDr. Ludvíkem Štorkem, IČO: 01051393, se sídlem Arnošta z Pardubic 2082, 530 02 Pardubice (dále jen „poskytovatel") a pacienty (dále jen „klient").
              </p>
              
              <div className="card" id="section1">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-primary-500 mr-2" />
                    1. Úvodní ustanovení
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Poskytovatel je oprávněn poskytovat zdravotní služby v oboru všeobecné praktické lékařství na základě oprávnění k poskytování zdravotních služeb.
                    </p>
                    <p>
                      Poskytovatel poskytuje zdravotní služby v souladu se zákonem č. 372/2011 Sb., o zdravotních službách a podmínkách jejich poskytování, ve znění pozdějších předpisů, a dalšími právními předpisy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card" id="section2">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 text-primary-500 mr-2" />
                    2. Poskytování zdravotních služeb
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Zdravotní služby jsou klientovi poskytovány na základě jeho svobodného a informovaného souhlasu, není-li v zákoně uvedeno jinak.
                    </p>
                    <p>
                      Klient má právo na poskytování zdravotních služeb na náležité odborné úrovni, na úctu, důstojné zacházení, ohleduplnost a respektování soukromí.
                    </p>
                    <p>
                      Poskytovatel je povinen poskytovat zdravotní služby na náležité odborné úrovni, respektovat práva klienta a vést zdravotnickou dokumentaci.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card" id="section3">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-primary-500 mr-2" />
                    3. Objednání k poskytnutí zdravotních služeb
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Klient se může k poskytnutí zdravotních služeb objednat:
                    </p>
                    <ul className="list-none space-y-3 pl-0">
                      <li className="flex">
                        <Phone className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>telefonicky na čísle +420 466 030 435</span>
                      </li>
                      <li className="flex">
                        <Calendar className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>prostřednictvím online rezervačního systému na webových stránkách poskytovatele</span>
                      </li>
                      <li className="flex">
                        <UserCheck className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>osobně v ordinaci poskytovatele</span>
                      </li>
                    </ul>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4">
                      <p className="text-yellow-800 flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Poskytovatel si vyhrazuje právo na změnu termínu objednání v případě neodkladných okolností. O změně termínu bude klient informován.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-primary-500 mr-2" />
                    4. Zrušení rezervovaného termínu
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Klient je povinen zrušit rezervovaný termín nejpozději 24 hodin před plánovanou návštěvou, a to telefonicky nebo prostřednictvím online rezervačního systému.
                    </p>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <p className="text-red-800 flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Pokud klient rezervovaný termín nevyužije a předem jej nezruší, může poskytovatel požadovat úhradu administrativního poplatku ve výši 200 Kč.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" id="section4">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 text-primary-500 mr-2" />
                    5. Úhrada za poskytnuté služby
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Zdravotní služby, které jsou hrazeny z veřejného zdravotního pojištění, jsou poskytovány klientům pojištěným u zdravotních pojišťoven, s nimiž má poskytovatel uzavřenu smlouvu, bez přímé úhrady.
                    </p>
                    <p>
                      Zdravotní služby nehrazené z veřejného zdravotního pojištění, administrativní úkony a nadstandardní služby jsou zpoplatněny dle aktuálního ceníku poskytovatele. Klient je povinen uhradit cenu těchto služeb v hotovosti nebo přes QR kód (aplikace Zaplať mi) bezprostředně po jejich poskytnutí.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 text-primary-500 mr-2" />
                    6. Práva a povinnosti klienta
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Klient je povinen:
                    </p>
                    <ul className="list-none space-y-3 pl-0">
                      {[
                        "pravdivě informovat poskytovatele o svém zdravotním stavu a o všech skutečnostech podstatných pro poskytování zdravotních služeb",
                        "řídit se pokyny poskytovatele směřujícími k úspěšné léčbě",
                        "dodržovat vnitřní řád ordinace",
                        "uhradit cenu poskytnutých služeb, které nejsou hrazeny z veřejného zdravotního pojištění",
                        "respektovat práva ostatních klientů a personálu poskytovatele",
                        "dodržovat dohodnuté termíny návštěv"
                      ].map((item, index) => (
                        <li key={index} className="flex">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-primary-500 mr-2" />
                    7. Ochrana osobních údajů
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Poskytovatel zpracovává osobní údaje klientů v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů.
                    </p>
                    <p>
                      Podrobné informace o zpracování osobních údajů jsou dostupné v dokumentu "Ochrana osobních údajů" na webových stránkách poskytovatele.
                    </p>
                    <div className="mt-4">
                      <a 
                        href="/ochrana-osobnich-udaju" 
                        className="btn btn-primary flex items-center justify-center w-full"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Ochrana osobních údajů
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Scale className="w-5 h-5 text-primary-500 mr-2" />
                    8. Závěrečná ustanovení
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Tyto podmínky jsou platné a účinné od 1.1.2024.
                    </p>
                    <p>
                      Poskytovatel si vyhrazuje právo na změnu těchto obchodních podmínek. Nové znění obchodních podmínek bude zveřejněno na webových stránkách poskytovatele a v ordinaci poskytovatele.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 text-center mt-8">
                <p>
                  V Pardubicích dne 1.1.2024<br />
                  MUDr. Ludvík Štorek
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsPage;