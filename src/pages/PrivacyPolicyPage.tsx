import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Shield, Lock, User, Database, CheckSquare, Mail, Camera, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Ochrana osobních údajů | MUDr. Ludvík Štorek</title>
        <meta 
          name="description" 
          content="Zásady ochrany osobních údajů ordinace MUDr. Ludvíka Štorka." 
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
            Ochrana osobních údajů
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}            
            className="text-xl font-light"            
          >
            Informace o zpracování osobních údajů
          </motion.p>
        </div>
      </section>

      {/* Mobile Quick Navigation */}
      <div className="sticky top-16 z-20 bg-white shadow-md py-3 md:hidden">
        <div className="flex space-x-4 overflow-x-auto px-4 no-scrollbar">
          <a href="#principles" className="whitespace-nowrap px-3 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg flex-shrink-0">
            Zásady
          </a>
          <a href="#processing" className="whitespace-nowrap px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex-shrink-0">
            Zpracování
          </a>
          <a href="#contact" className="whitespace-nowrap px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex-shrink-0">
            Kontakt
          </a>
          <a href="#info" className="whitespace-nowrap px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex-shrink-0">
            GDPR
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
                Od 25.5.2018 platí nařízení Evropského parlamentu a Rady 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů, zkráceně: Obecné nařízení o ochraně osobních údajů (angl. General Data Protection Regulation neboli GDPR).
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 my-6">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900 m-0">Ochrana osobních údajů</h3>
                </div>
                <p className="text-blue-800 mb-0">
                  V této ambulanci se od samého začátku snažíme co nejvíce ochránit všechna citlivá data, se kterými disponujeme. Pojem „lékařské tajemství" známe už z dob dávno minulých a ctíme s co největší měrou.
                </p>
              </div>

              <div className="mt-8" id="principles">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Lock className="w-6 h-6 text-primary-500 mr-2" />
                  Zásady nakládání s osobními údaji
                </h2>
                <div className="space-y-4">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <User className="w-5 h-5 text-primary-500 mr-2" />
                        Heslo pro telefonickou komunikaci
                      </h3>
                      <p>Každý pacient nahlásí sestře heslo pro komunikaci po telefonu (pro zábránění sdělení informací nekompetentním osobám)</p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Mail className="w-5 h-5 text-primary-500 mr-2" />
                        Emailová komunikace
                      </h3>
                      <p>Pokud bude pacient chtít zaslat jakoukoli informaci po emailu - jako např. výsledky, e-recepty, tak o vyšetření požádá na můj email z adresy, která je uvedena v naší databázi. Tím vezme na vědomí, že emailová komunikace je nechráněný způsob sdělování informací a může být zneužita jinou osobou.</p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <FileText className="w-5 h-5 text-primary-500 mr-2" />
                        Přístup k dokumentaci
                      </h3>
                      <p>K vaší zdravotní dokumentaci má přístup jen lékař a sestra. Elektronické dokumenty jsou zálohovány výhradně na zaheslované externí disky, nikoli na cloud.</p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Camera className="w-5 h-5 text-primary-500 mr-2" />
                        Kamerový systém
                      </h3>
                      <p>Kamera v čekárně je určena k monitoraci prostoru bez možnosti záznamu.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8" id="processing">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Database className="w-6 h-6 text-primary-500 mr-2" />
                  Zákonné zpracování osobních údajů
                </h2>
                <div className="card">
                  <div className="card-body">
                    <p className="mb-4">Ordinace praktického lékaře MUDr. Ludvíka Štorka zpracovává osobní údaje pacientů v souladu s:</p>
                    <ul className="list-none pl-0 space-y-3">
                      {[
                        "Nařízením EU 2016/679 (GDPR)", 
                        "Zákonem č. 372/2011 Sb., o zdravotních službách", 
                        "Zákonem č. 48/1997 Sb., o veřejném zdravotním pojištění"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckSquare className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4">Zpracování osobních údajů probíhá v rozsahu nezbytném pro poskytování zdravotní péče a plnění zákonných povinností.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8" id="contact">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <CheckSquare className="w-6 h-6 text-primary-500 mr-2" />
                  Kontakt pro dotazy ohledně zpracování osobních údajů
                </h2>
                <div className="card">
                  <div className="card-body">
                    <p className="mb-4">V případě dotazů ohledně zpracování vašich osobních údajů nás můžete kontaktovat:</p>
                    <div className="space-y-3">
                      <p className="flex items-center">
                        <Mail className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                        <span><strong>Email:</strong> mudr.storek@seznam.cz</span>
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                        <span><strong>Telefon:</strong> +420 466 030 435</span>
                      </p>
                      <p className="flex items-start">
                        <MapPin className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                        <span><strong>Adresa:</strong> Arnošta z Pardubic 2082, 530 02 Pardubice</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 text-center mt-8">
                <p>Tyto zásady ochrany osobních údajů jsou platné a účinné od 1.1.2024.</p>
              </div>
              
              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200" id="info">
                <h3 className="text-xl font-semibold mb-4 text-center">Informace pro pacienty o zpracování osobních údajů</h3>
                <div className="prose prose-lg max-w-none">
                  <p>Vážená paní, vážený pane,</p>
                  
                  <p>v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 ze dne 27. dubna 2016 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (dále jen „GDPR") si Vás dovolujeme informovat o zpracování Vašich osobních údajů.</p>
                  
                  <h4 className="mt-5 mb-3 text-lg font-semibold">1. Správce osobních údajů</h4>
                  <p>Správcem Vašich osobních údajů je MUDr. Ludvík Štorek, IČO: 01051393, se sídlem Arnošta z Pardubic 2082, 530 02 Pardubice (dále jen „správce").</p>
                  
                  <h4 className="mt-5 mb-3 text-lg font-semibold">2. Účel zpracování osobních údajů</h4>
                  <p>Vaše osobní údaje zpracováváme za účelem:</p>
                  <ul className="list-none pl-0 space-y-2">
                    {[
                      "poskytování zdravotních služeb",
                      "vyúčtování poskytnutých zdravotních služeb",
                      "vykazování hrazených zdravotních služeb",
                      "sdělování údajů o zdravotním stavu Vám a dalším oprávněným osobám",
                      "organizace poskytování zdravotních služeb"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="mt-5 mb-3 text-lg font-semibold">3. Rozsah zpracovávaných osobních údajů</h4>
                  <p>Zpracováváme pouze údaje, které jsou pro výše uvedené účely nezbytné:</p>
                  <ul className="list-none pl-0 space-y-2">
                    {[
                      "identifikační údaje (jméno, příjmení, rodné číslo, číslo pojištěnce)",
                      "kontaktní údaje (adresa, telefon, e-mail)",
                      "údaje o zdravotním stavu",
                      "údaje o poskytnutých zdravotních službách"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="mt-5 mb-3 text-lg font-semibold">4. Právní základ zpracování</h4>
                  <p>Vaše osobní údaje zpracováváme na základě:</p>
                  <ul className="list-none pl-0 space-y-2">
                    {[
                      "plnění právní povinnosti (zákon č. 372/2011 Sb., o zdravotních službách, zákon č. 48/1997 Sb., o veřejném zdravotním pojištění)",
                      "oprávněného zájmu správce",
                      "plnění smlouvy o poskytování zdravotních služeb"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="mt-5 mb-3 text-lg font-semibold">5. Doba zpracování</h4>
                  <p>Vaše osobní údaje zpracováváme po dobu stanovenou právními předpisy, zejména zákonem o zdravotních službách a vyhláškou o zdravotnické dokumentaci.</p>
                  
                  <h4 className="mt-5 mb-3 text-lg font-semibold">6. Vaše práva</h4>
                  <p>V souvislosti se zpracováním Vašich osobních údajů máte následující práva:</p>
                  <ul className="list-none pl-0 space-y-2">
                    {[
                      "právo na přístup k osobním údajům",
                      "právo na opravu",
                      "právo na výmaz (s výjimkou údajů, které jsme povinni uchovávat ze zákona)",
                      "právo na omezení zpracování",
                      "právo na přenositelnost údajů",
                      "právo podat stížnost u Úřadu pro ochranu osobních údajů"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <a 
                  href="https://i.imgur.com/z8c0RLE.png" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary inline-flex items-center"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Stáhnout informace o zpracování osobních údajů
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;