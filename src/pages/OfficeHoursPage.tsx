import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const officeHours = [
  {
    day: 'PO',
    hours: '08:00–14:30',
    acute: '08:00–08:30',
    web: '08:30–10:30',
    phone: '10:30–11:30',
    phoneBooking: '11:30–14:30',
    company: '–'
  },
  {
    day: 'ÚT',
    hours: '07:00–13:00',
    acute: '07:00–07:30',
    web: '07:30–08:30',
    phone: '08:30–09:30',
    phoneBooking: '09:30–11:30',
    company: '11:30–13:00'
  },
  {
    day: 'ST',
    hours: '13:00–18:30',
    acute: '13:00–13:30',
    web: '13:30–15:30',
    phone: '15:30–16:15',
    phoneBooking: '16:30–18:30',
    company: '–'
  },
  {
    day: 'ČT',
    hours: '07:00–14:00',
    acute: '07:00–07:30',
    web: '07:30–09:30',
    phone: '09:30–10:30',
    phoneBooking: '11:30–14:00',
    company: '10:30–11:30'
  },
  {
    day: 'PÁ',
    hours: '07:00–12:00',
    acute: '07:00–07:30',
    web: '07:30–08:30',
    phone: '08:30–09:30',
    phoneBooking: '09:30–12:00',
    company: '–'
  }
];

const OfficeHoursPage = () => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ordinační hodiny | MUDr. Ludvík Štorek</title>
        <meta
          name="description"
          content="Ordinační a provozní doba ordinace MUDr. Ludvíka Štorka v Pardubicích. Přehled časů pro akutní stavy, online objednávání a telefonní konzultace."
        />
      </Helmet>

      <section className="bg-primary-500 text-white py-12">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 mt-2"
          >
            Ordinační doba
          </motion.h1>
        </div>
      </section>

      <section className="section bg-white py-12">
        <div className="container">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="mb-4">Ordinační a provozní doba</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="card shadow-card">
              <div className="card-body p-4 md:p-1">
                <div className="flex items-center mb-1">
                </div>
                <div className="hidden md:block w-full">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-primary-50">
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[10%]">Den</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">Ordinační doba</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Akutní stavy bez objednání
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Pacienti objednaní online
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Telefonní konzultace a objednávání
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            Pacienti objednaní po telefonu
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Závodní péče – objednaní online
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {officeHours.map((item, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                        >
                          <td className="py-3 px-4 font-medium border-b border-gray-100">{item.day}</td>
                          <td className="py-3 px-4 border-b border-gray-100 font-medium text-primary-600">{item.hours}</td>
                          <td className="py-3 px-4 border-b border-gray-100 text-red-600">{item.acute}</td>
                          <td className="py-3 px-4 border-b border-gray-100 text-green-600">{item.web}</td>
                          <td className="py-3 px-4 border-b border-gray-100 text-blue-600">{item.phone}</td>
                          <td className="py-3 px-4 border-b border-gray-100 text-yellow-600">{item.phoneBooking}</td>
                          <td className="py-3 px-4 border-b border-gray-100 text-purple-600">{item.company}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {officeHours.map((item, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <button
                        className="w-full bg-primary-50 px-5 py-4 font-semibold text-lg flex justify-between items-center"
                        onClick={() => toggleDay(item.day)}
                        aria-expanded={expandedDay === item.day}
                        aria-controls={`day-content-${item.day}`}
                      >
                        <span>{item.day}</span>
                        <div className="flex items-center">
                          <span className="text-primary-500 mr-2">{item.hours}</span>
                          {expandedDay === item.day ? (
                            <ChevronUp className="w-5 h-5 text-primary-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-primary-500" />
                          )}
                        </div>
                      </button>

                      {expandedDay === item.day && (
                        <div id={`day-content-${item.day}`} className="p-5 space-y-4 border-t border-gray-100">
                          <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center flex-1">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></span>
                              <span className="font-medium text-red-800 text-sm sm:text-base">
                                Akutní stavy bez objednání
                              </span>
                            </div>
                            <span className="text-red-600 font-medium text-sm sm:text-base pl-6">
                              {item.acute}
                            </span>
                          </div>

                          <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center flex-1">
                              <span className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></span>
                              <span className="font-medium text-green-800 text-sm sm:text-base">
                                Pacienti objednaní online
                              </span>
                            </div>
                            <span className="text-green-600 font-medium text-sm sm:text-base pl-6">
                              {item.web}
                            </span>
                          </div>

                          <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center flex-1">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></span>
                              <span className="font-medium text-blue-800 text-sm sm:text-base">
                                Telefonní konzultace a objednávání
                              </span>
                            </div>
                            <span className="text-blue-600 font-medium text-sm sm:text-base pl-6">
                              {item.phone}
                            </span>
                          </div>

                          <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center flex-1">
                              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></span>
                              <span className="font-medium text-yellow-800 text-sm sm:text-base">
                                Pacienti objednaní po telefonu
                              </span>
                            </div>
                            <span className="text-yellow-600 font-medium text-sm sm:text-base pl-6">
                              {item.phoneBooking}
                            </span>
                          </div>

                          {item.company !== '–' && (
                            <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                              <div className="flex items-center flex-1">
                                <span className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></span>
                                <span className="font-medium text-purple-800 text-sm sm:text-base">
                                  Závodní péče – objednaní online
                                </span>
                              </div>
                              <span className="text-purple-600 font-medium text-sm sm:text-base pl-6">
                                {item.company}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-sm text-gray-600 flex items-start">
                  <Info className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    Pro akutní stavy je vyhrazen čas na začátku ordinační doby. V případě život ohrožujícího stavu volejte linku 155.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Need to make an appointment? */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center mb-6">Potřebujete se objednat?</h2>
            <div className="max-w-6xl mx-auto text-center">
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

export default OfficeHoursPage;
