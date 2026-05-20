import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Award, Stethoscope, BookOpen, Languages, GraduationCap, Calendar, Briefcase, UserCircle, BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Staff data
const staff = [
  {
    id: 1,
    name: 'MUDr. Ludvík Štorek',
    role: 'Praktický lékař',
    image: 'https://i.imgur.com/dDUaBoY.png',
    isLandscape: true,
    summary: 'Zkušený lékař s více než 25 lety praxe specializující se na komplexní péči o dospělé pacienty s důrazem na prevenci a léčbu akutních i chronických onemocnění.',
    certifications: [
      'Atestace v oboru Urgentní medicína - spec. způsobilost*',
      'Atestace v oboru Intenzivní medicína - spec. způsobilost*',
      'Dvě atestace z anesteziologie a resuscitace - spec. způsobilost*',
      'Atestace v obou Všeobecné praktické lékařství - spec. způsobilost*'
    ],
    education: [
      'Gymnázium Hlinsko - absol. 1990',
      'Lékařská fakulta Univerzity Karlovy v Hradci Králové - absol. 1996',
      'Držitel Diplomu celoživotního vzdělávání lékařů do 21.10.2027',
      'Akreditované pracoviště MZ ČR pro obor všeobecné praktické lékařství pro oba stupně od 2019'
    ],
    currentPractice: [
      'Zdravotnická záchranná služba Pardubického kraje - lékař výjezdového stanoviště',
      'OK Ambulance s.r.o. - letecká repatriace pacientů ze zahraničí'
    ],
    experience: [
      'Zákl. vojenská služba : VLA JEP HK, poté Posádková ošetřovna Letiště Čáslav',
      'Nemocnice Pelhřimov - lékař ARO',
      'Nemocnice Pardubice - lékař ARO',
      'Zdravotnická záchranná služba Pardubického kraje - ved.lékař výjezdového stanoviště',
      'Přeloučská poliklinika a.s. - praktický lékař',
      'Litomyšlská nemocnice a.s. - lékař ARO (pouze služby)'
    ],
    languages: ['Čeština', 'Angličtina', 'Ruština'],
    memberships: ['Česká lékařská komora', 'SPL ČR'],
    bio: 'MUDr. Ludvík Štorek je zkušený praktický lékař s více než 25 lety praxe. Věnuje se komplexní péči o dospělé pacienty se zaměřením na prevenci a léčbu akutních i chronických onemocnění. Ve své praxi klade důraz na individuální přístup ke každému pacientovi.'
  },
  {
    id: 2,
    name: 'Ivana Soudková',
    role: 'Zdravotní sestra',
    image: 'https://i.imgur.com/eq00FjS.jpeg',
    isLandscape: false,
    summary: 'Empatická a profesionální zdravotní sestra s mnohaletou praxí a zkušenostmi z kardiologického oddělení Pardubické nemocnice.',
    certifications: [],
    education: [
      'Plně kvalifikovaná sestra s praxí na Kardiologii Pardubické nemocnice.'
    ],
    currentPractice: [],
    experience: [],
    languages: ['Čeština'],
    memberships: [],
    bio: 'Ivana Soudková je zkušená zdravotní sestra s dlouholetou praxí. V ordinaci zajišťuje odběry krve, EKG vyšetření, aplikaci injekcí, převazy a další zdravotnické úkony. Je empatická a vždy ochotná pomoci pacientům s jejich problémy.'
  }
];

const StaffMemberCard = ({ member }) => {
  const [expandedSections, setExpandedSections] = useState({
    certifications: true,
    education: true,
    experience: false,
    currentPractice: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const renderSection = (title, items, icon, section) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <button 
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-left transition-colors mb-3"
        >
          <div className="flex items-center">
            {icon}
            <h3 className="font-semibold text-lg ml-2">{title}</h3>
          </div>
          {expandedSections[section] ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        {expandedSections[section] && (
          <div className="pl-3 border-l-2 border-primary-100 ml-3">
            <ul className="space-y-2 text-gray-700">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <BadgeCheck className="w-4 h-4 text-primary-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {section === 'certifications' && member.id === 1 && (
              <p className="mt-2 text-xs text-gray-500 italic">*spec. způsobilost = maximální dosažitelné vzdělání</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
    >
      <div className="relative">
        <div className="flex justify-center bg-gradient-to-r from-primary-100 to-primary-50">
          <div className="h-[450px] w-[300px] overflow-hidden">
            <img 
              src={member.image} 
              alt={member.name} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
          <h2 className="text-white text-2xl font-bold">{member.name}</h2>
          <p className="text-primary-100 font-medium">{member.role}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{member.summary}</p>
        </div>

        {renderSection(
          "Vzdělání a kvalifikace", 
          member.education, 
          <GraduationCap className="w-5 h-5 text-primary-500" />,
          "education"
        )}

        {renderSection(
          "Získané atestace", 
          member.certifications, 
          <Award className="w-5 h-5 text-primary-500" />,
          "certifications"
        )}

        {renderSection(
          "Současná praxe", 
          member.currentPractice, 
          <Briefcase className="w-5 h-5 text-primary-500" />,
          "currentPractice"
        )}

        {renderSection(
          "Dosavadní praxe", 
          member.experience, 
          <Calendar className="w-5 h-5 text-primary-500" />,
          "experience"
        )}

        {member.languages && member.languages.length > 0 && (
          <div className="flex items-center text-gray-700 mt-4">
            <Languages className="w-5 h-5 text-primary-500 mr-2" />
            <span className="font-medium mr-2">Jazyky:</span>
            {member.languages.map((lang, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm mr-1">{lang}</span>
            ))}
          </div>
        )}

        {member.memberships && member.memberships.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start">
              <UserCircle className="w-5 h-5 text-primary-500 mr-2 mt-1" />
              <div>
                <span className="font-medium">Členství:</span>
                <ul className="mt-1 space-y-1 text-sm text-gray-700">
                  {member.memberships.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StaffPage = () => {
  return (
    <>
      <Helmet>
        <title>Náš tým | MUDr. Ludvík Štorek</title>
        <meta 
          name="description" 
          content="Poznejte náš tým zdravotnických profesionálů v ordinaci MUDr. Ludvíka Štorka." 
        />
      </Helmet>

      {/* Header */}
      <section className="bg-primary-500 text-white py-10">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 mt-2"
          >
            Náš tým
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

      {/* Staff Members */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
            {staff.map((person) => (
              <StaffMemberCard key={person.id} member={person} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StaffPage;