import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Info, Check, HelpCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// Pricing data
const standardServices = [
  {
    title: 'Preventivní prohlídka',
    price: 'Hrazeno pojišťovnou',
    description: 'Kompletní preventivní prohlídka včetně základních laboratorních vyšetření.',
    insurance: true
  },
  {
    title: 'Akutní vyšetření',
    price: 'Hrazeno pojišťovnou',
    description: 'Vyšetření při akutních obtížích.',
    insurance: true
  },
  {
    title: 'Kontrolní vyšetření',
    price: 'Hrazeno pojišťovnou',
    description: 'Kontrolní vyšetření chronických onemocnění.',
    insurance: true
  },
  {
    title: 'EKG vyšetření',
    price: 'Hrazeno pojišťovnou',
    description: 'Vyšetření elektrické aktivity srdce.',
    insurance: true
  },
  {
    title: 'CRP vyšetření',
    price: 'Hrazeno pojišťovnou',
    description: 'Vyšetření zánětlivých markerů z kapky krve.',
    insurance: true
  },
];

const extraServices = [
  {
    title: 'Vyšetření pro řidičský a jiný profesní průkaz',
    price: '500 Kč',
    description: 'Vyšetření a vystavení potvrzení pro získání nebo obnovení řidičského či profesního průkazu.',
    insurance: false
  },
  {
    title: 'Vyšetření pro zbrojní pas',
    price: '800 Kč',
    description: 'Vyšetření a vystavení potvrzení pro získání zbrojního průkazu.',
    insurance: false
  },
  {
    title: 'Vyšetření studentů k potvrzení přihlášky',
    price: 'zdarma',
    description: 'Vyšetření studentů k potvrzení přihlášky na VŠ, tábor a podobně.',
    insurance: false
  },
  {
    title: 'Výpis ze zdravotní dokumentace pro komerční pojišťovnu',
    price: '400 Kč',
    description: 'Výpis ze zdravotní dokumentace pro komerční pojišťovnu (za každý formulář dle rozsahu).',
    insurance: false
  },
  {
    title: 'Vyplnění pojistky (bolestné)',
    subItems: [
      { label: 'Jeden list', price: '400 Kč' },
      { label: 'Dva listy a více', price: '600 Kč' }
    ],
    insurance: false
  },
  {
    title: 'Potvrzení o trvání PN v souvislosti s prac. úrazem',
    price: '100 Kč',
    description: 'Vyplnění potvrzení o trvání pracovní neschopnosti v souvislosti s pracovním úrazem (měsíčně).',
    insurance: false
  },
  {
    title: 'Výpis ze zdravotní dokumentace pro závodní péči',
    price: '400 Kč',
    description: 'Výpis ze zdravotní dokumentace pro závodního lékaře nebo pracovnělékařskou péči.',
    insurance: false
  },
  {
    title: 'Vyplnění formuláře před umístěním do ústavu soc. péče',
    price: '300 Kč',
    description: 'Vyplnění jednoho formuláře před umístěním pacienta do ústavu sociální péče.',
    insurance: false
  },
  {
    title: 'Očkování na vlastní žádost (aplikace)',
    price: '150 Kč',
    description: 'Aplikační poplatek za očkování na vlastní žádost (cena vakcíny není zahrnuta).',
    insurance: false
  },
  {
    title: 'Pracovnělékařská prohlídka',
    price: '800 Kč',
    description: 'Vstupní, periodická nebo výstupní prohlídka pro zaměstnavatele.',
    insurance: false
  },
  {
    title: 'Jiná administrativní činnost',
    price: '500 Kč',
    description: 'Jiná administrativní činnost po 15 minutách práce lékaře.',
    insurance: false
  },
  {
    title: 'Vyšetření okultního krvácení - samoplátce',
    price: '300 Kč',
    description: 'Test na skryté krvácení ve stolici pro samoplátce.',
    insurance: false
  },
  {
    title: 'Předoperační vyšetření k výkonu nehrazenému ze zdrav. pojištění',
    price: '500 Kč',
    description: 'Předoperační vyšetření pro zákroky, které nejsou hrazeny ze zdravotního pojištění.',
    insurance: false
  },
  {
    title: 'Vystavení duplikátu dokumentu',
    price: '50 Kč',
    description: 'Vystavení duplikátu jakéhokoli lékařského dokumentu.',
    insurance: false
  },
  {
    title: 'Fotokopie z dokumentace - formát A4/stránka',
    price: '5 Kč',
    description: 'Pořízení fotokopie ze zdravotní dokumentace, cena za jednu stranu formátu A4.',
    insurance: false
  },
  {
    title: 'Vyšetření pacienta bez zdravotního pojištění',
    price: '500 Kč',
    description: 'Vyšetření pacienta bez zdravotního pojištění po 15 minutách.',
    insurance: false
  },
  {
    title: 'Neomluvená absence',
    price: '300 Kč',
    description: 'Neomluvená absence pacienta objednaného k vyšetření',
    insurance: false
  },
];

const PricingPage = () => {
  return (
    <>
      <Helmet>
        <title>Ceník služeb | MUDr. Ludvík Štorek</title>
        <meta
          name="description"
          content="Ceník lékařských služeb ordinace MUDr. Ludvíka Štorka - přehled hrazených i nehrazených výkonů."
        />
      </Helmet>

      {/* Header */}
      <section className="bg-primary-500 text-white py-12">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 ml-6"
          >
            Ceník služeb
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light ml-6"
          >
            Ceník pojišťovnou nehrazených výkonů
          </motion.p>
        </div>
      </section>

      {/* Extra Services */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="mb-0 ml-6">Nadstandardní a administrativní služby</h2>
            <p className="mb-8 text-gray-600 ml-6">Platné od 5. ledna 2026</p>
            <div className="overflow-hidden bg-white rounded-xl shadow-card">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Služba</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-24">Cena</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {extraServices.map((service, index) => {
                    const isUnexcusedAbsence = service.title === 'Neomluvená absence';
                    const hasSubItems = service.subItems && service.subItems.length > 0;

                    return (
                      <tr
                        key={index}
                        className={`transition-colors ${isUnexcusedAbsence
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <td className="px-6 py-4" colSpan={hasSubItems ? 2 : 1}>
                          <div>
                            <h3 className="font-medium text-gray-900">{service.title}</h3>
                            {service.description && (
                              <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                            )}
                            {hasSubItems && (
                              <div className="mt-4 space-y-3">
                                {service.subItems.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between pb-3 border-b border-gray-200"
                                  >
                                    <span className="text-gray-700">{item.label}</span>
                                    <span className="font-medium text-primary-600 ml-6">{item.price}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        {!hasSubItems && (
                          <td className="px-6 py-4 text-right font-medium text-primary-600 whitespace-nowrap align-top">
                            {service.price}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="mb-4">Způsoby platby</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Nabízíme několik možností platby pro vaše pohodlí
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hotovost */}
              <div className="card">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Hotovost</h3>
                  <p className="text-gray-600">
                    Přijímáme platby v hotovosti přímo v ordinaci
                  </p>
                </div>
              </div>

              {/* QR Platba */}
              <div className="card">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M7 7h4v4H7z" />
                      <path d="M13 7h4v4h-4z" />
                      <path d="M7 13h4v4H7z" />
                      <circle cx="15" cy="15" r="2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">QR Platba</h3>
                  <p className="text-gray-600">
                    Možnost platby přes QR kód pomocí aplikace Zaplať mi
                  </p>
                </div>
              </div>

              {/* Platební karty */}
              <div className="card">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Platební karty</h3>
                  <p className="text-gray-600 mb-4">
                    Nově přijímáme platby kartou
                  </p>
                  <div className="flex justify-center gap-2">
                    <img src="https://i.imgur.com/pzkxwPg.png" alt="Visa" className="h-10" />
                    <img src="https://i.imgur.com/XROsimt.png" alt="Mastercard" className="h-10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;