import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Stethoscope, CheckCircle, FlaskRound as Flask, Building, Mail, Phone, FileText, HeartPulse, MoveRight, Microscope, ListChecks, CalendarCheck, Building2, XCircle } from 'lucide-react';
import { Link, Element } from 'react-scroll';

const OrdinacePage = () => {
  return (
    <>
      <Helmet>
        <title>Informace pro pacienty | MUDr. Ludvík Štorek</title>
        <meta
          name="description"
          content="Důležité informace pro pacienty ordinace MUDr. Ludvíka Štorka - vybavení ordinace, pokyny k vyšetřením, laboratorní testy."
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
            Informace pro pacienty
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light"
          >
            Vše, co potřebujete vědět o naší ordinaci a poskytovaných službách
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left sidebar navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <nav className="card p-0 overflow-hidden">
                  <ul className="divide-y divide-gray-100">
                    <li>
                      <Link
                        to="ordinace"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Building className="w-5 h-5 text-primary-500 mr-3" />
                        <span>O ordinaci</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="laboratorni-testy"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Flask className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Laboratorní testy</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="vybaveni"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Stethoscope className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Vybavení ordinace</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="predoperacni"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <HeartPulse className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Předoperační vyšetření</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="email-komunikace"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-primary-500 mr-3" />
                        <span>E-mailová komunikace</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="telefonicka-komunikace"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Telefonická komunikace</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="specialni-vysetreni"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <ListChecks className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Speciální vyšetření</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="pracovnelekarska-pece"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Building2 className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Pracovnělékařská péče</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="objednavani"
                        smooth={true}
                        duration={500}
                        spy={true}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <CalendarCheck className="w-5 h-5 text-primary-500 mr-3" />
                        <span>Objednávání</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-2 space-y-10">
              {/* About the practice */}
              <Element name="ordinace">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <Building className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">O ordinaci</h2>
                      </div>
                      <p className="mb-4">
                        Mimo obvyklou náplň praktického lékaře pro pojišťovny 111, 201, 205, 207, 211 poskytujeme:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>pro registrované pacienty bezplatné konzultace ohledně anesteziologie, intenzivní, urgentní a cestovní medicíny /mám osobní zkušenosti z cestování do exotických krajů/</span>
                        </li>
                        <li className="flex">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>očkování, viz. <a href="https://www.avenier.cz" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">www.avenier.cz</a></span>
                        </li>
                        <li className="flex">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>smluvní pracovnělékařskou péči pro velké i malé podniky</span>
                        </li>
                      </ul>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start mb-6">
                        <CheckCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-800">
                          <strong>Důležité upozornění:</strong> V současné době nepřijímáme nové pojištěnce.
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                        <FileText className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-800">
                          <strong>Pro pacienty s pracovní neschopností:</strong> Každý pacient si při vystavení pracovní neschopnosti zajistí přesný název a adresu zaměstnavatele (pokud ještě není v systému OSSZ).
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Laboratory tests */}
              <Element name="laboratorni-testy">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <Flask className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">Pokyny pro pacienty ohledně laboratorních testů</h2>
                      </div>
                      <p className="mb-4">
                        Žádanky vypisujeme elektronicky. To znamená, že nedostanete klasickou papírovou žádanku, ale potřebná vyšetření se zadají do systému. Vy v požadovaném termínu zajdete bez objednání mezi 6:30-9:00 na lačno s průkazkou zdravotní pojišťovny do odběrové místnosti firmy Medila.
                      </p>
                      <p className="mb-4">
                        Pokud potřebujete kopii laboratorních výsledků, požádejte odběrovou sestru v Medile, aby výsledky přeposlala na váš email.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-3">Odběrová místa Medila:</h3>
                        <ul className="space-y-2 text-gray-700 pl-5 list-disc">
                          <li>budova "Veteriny" ve Štrossově ulici č.p. 239</li>
                          <li>poliklinika Vektor v Rokycanově ulici č.p. 2798 /naproti Policii Na Spravedlnosti/</li>
                          <li>poliklinika Kolf, Masarykovo náměstí č.p. 2667 vedle Tesca a AFI Palace</li>
                          <li>odběrové centrum Polabiny, Kosmonautů č.p. 399 u "Pergoly" (NIKOLI poliklinika na Karla Šípka!!)</li>
                          <li>poliklinika Holice, Náměstí T. G. Masaryka 29, Holice</li>
                          <li>odběrové centrum Přelouč v budově Agry u nádraží (NIKOLI na poliklinice v Libušině ulici!!)</li>
                          <li>poliklinika II., Slezské předměstí, Bratří Štefanů 895, Hradec Králové</li>
                          <li>odběrové centrum, Fibichova 212, Chrudim</li>
                          <li>a mnoho dalších vzdálenějších měst, viz <a href="https://www.medila.cz" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">www.medila.cz</a></li>
                        </ul>
                      </div>
                      <p className="mb-3">
                        Výsledky základních vyšetření přijdou elektronicky týž den odpoledne. Speciální vyšetření /např. protilátky/ budou hotová do týdne. Odběry přímo v naší ambulanci provádíme výjimečně po předchozím objednání.
                      </p>
                      <div className="space-y-3 text-gray-700">
                        <p>
                          <strong>Vyšetření moči:</strong> se provádí buď zde nebo v laboratoři - pozorně naslouchejte pokynů sestry nebo lékaře.
                        </p>
                        <p>
                          <strong>Vyšetření zraku:</strong> pacienti, kteří potřebují vyšetření zraku např. pro řidičský průkaz, si s sebou berou brýle.
                        </p>
                        <p>
                          <strong>Močové potíže:</strong> při močových potížích a při všech pracovnělékařských a preventivních prohlídkách noste ranní moč.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Equipment */}
              <Element name="vybaveni">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <Stethoscope className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">Vybavení ordinace</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Měření CRP</p>
                            <p className="text-sm text-gray-600">Přes určitá úskalí určí závažnost infekce, rozliší bakteriální a virovou infekci a naznačí, jestli antibiotika ano nebo ne</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Měření INR</p>
                            <p className="text-sm text-gray-600">Pro monitoraci "Quick" u pacientů užívajících Warfarin</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Glukometr</p>
                            <p className="text-sm text-gray-600">Měření hladiny cukru v krvi</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Bezbariérový přístup</p>
                            <p className="text-sm text-gray-600">Pro snadný přístup všech pacientů</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Klimatizace</p>
                            <p className="text-sm text-gray-600">Na pracovišti sestry a lékaře je klimatizace, v čekárně stropní ventilátor a odsávání vzduchu</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Tlakový Holter (ABPM)</p>
                            <p className="text-sm text-gray-600">24hodinová monitorace krevního tlaku, poté vyhodnocení v počítači</p>
                          </div>
                        </div>
                        <div className="flex">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Streptest</p>
                            <p className="text-sm text-gray-600">Rychlá diagnostika (do 5 minut) na přítomnost Streptokoka v hrdle</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Přístrojová analýza stolice (TOKS, FOB)</p>
                            <p className="text-sm text-gray-600">Na přítomnost krve</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">EKG</p>
                            <p className="text-sm text-gray-600">Analýza elektrické aktivity srdce</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Otoskopie</p>
                            <p className="text-sm text-gray-600">Vizuální vyšetření zvukovodu a bubínku</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Pulsní oxymetrie</p>
                            <p className="text-sm text-gray-600">Neinvazivní měření obsahu kyslíku v krvi</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Preoperative examinations */}
              <Element name="predoperacni">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <HeartPulse className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">Předoperační vyšetření</h2>
                      </div>
                      <p className="mb-4">
                        Před každou operací pacient zavolá sestře (cca 14 dní před výkonem) a domluví rozsah předoperačního vyšetření - bude vystavena elektronická žádanka na laboratorní vyšetření krve a moči a bude ev. vystavena žádanka na RTG plic (pac. ji převezme v ordinaci osobně). Taky domluví se sestrou termín samotného předoperačního vyšetření.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800">
                          <strong>Důležité:</strong> K samotnému předoperačnímu vyšetření v naší ambulanci pacient přichází po laboratorním vyšetření a po RTG plic (pokud je vyžadován).
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* E-mail Communication */}
              <Element name="email-komunikace">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <Mail className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">E-mailová komunikace</h2>
                      </div>
                      <p className="mb-3">
                        E-mail slouží k faktickým požadavkům, jako například:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-gray-700 mb-3">
                        <li>předepisování e-receptů</li>
                        <li>žádosti o laboratorní vyšetření</li>
                        <li>interpretaci výsledků</li>
                        <li>jednoduché zdravotní dotazy</li>
                        <li>zaslání potvrzení rezervace a odkazu na její zrušení</li>
                      </ul>
                      <div className="p-3 bg-red-50 text-red-800 rounded-lg mb-3">
                        <p className="font-medium">E-mail neslouží k:</p>
                        <ul className="space-y-1 pl-5 list-disc mt-1">
                          <li>objednávání k vyšetření</li>
                          <li>dotazům ohledně naší přítomnosti</li>
                          <li>upozorněním, že dnes přijdete, apod.</li>
                        </ul>
                      </div>
                      <p>
                        E-maily obsluhuji sám a odpovídám obvykle do dvou pracovních dnů. Pokud neobdržíte odpověď do 48 hodin, prosím urgujte.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Telephone Communication */}
              <Element name="telefonicka-komunikace">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <Phone className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">Telefonická komunikace</h2>
                      </div>
                      <p className="mb-3">
                        Prosíme, omezte zbytečnou telefonickou komunikaci, aby se mohli dovolat pacienti s oprávněnými dotazy. Telefon obsluhuje pouze sestra, která má i jiné povinnosti.
                      </p>
                      <p>
                        Preferujte prosím dobu určenou pro telefonické hovory. Pro objednání termínu využijte online systém na našich webových stránkách, kde můžete také rezervaci zrušit (nejpozději 24 hodin před termínem přes odkaz v potvrzovacím emailu).
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Special examinations */}
              <Element name="specialni-vysetreni">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <ListChecks className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">Speciální vyšetření</h2>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <h3 className="font-semibold mb-3 text-lg flex items-center">
                            <Microscope className="w-5 h-5 text-primary-500 mr-2" />
                            Streptest
                          </h3>
                          <p>
                            V ambulanci provádíme okamžité vyšetření na přítomnost Streptokoka v hrdle - nejčastější původce angíny. Tedy není nutno čekat 3 dny na výsledky výtěru z hrdla. Toto vyšetření plně hradí všechny zdravotní pojišťovny.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-3 text-lg flex items-center">
                            <HeartPulse className="w-5 h-5 text-primary-500 mr-2" />
                            Tlakový Holter
                          </h3>
                          <p className="mb-3">
                            Rutinně provádíme pro pacienty všech zdravotních pojišťoven kontrolu krevního tlaku systémem 24 hodinového monitorování, tzv. tlakový Holter /ABPM/. Tato metoda je indikována u pacientů s:
                          </p>
                          <ul className="space-y-1 pl-5 list-disc text-gray-700 mb-3">
                            <li>rezistentním tlakem</li>
                            <li>při podezření na pseudohypertenzi - mj. u pac. s hypertenzí bílého pláště</li>
                            <li>u těhotných hypertoniček</li>
                            <li>u pacientů s epizodickou hypertenzí - kolísavý tlak</li>
                            <li>obecně u pacientů k ověřování účinku antihypertenzních léků</li>
                          </ul>
                          <p className="mb-3">
                            "Navěšování" přístroje na pacienta provádíme kdykoli po vzájemné dohodě. Druhý den se pacient dostaví k vyhodnocení měření /provádí se pomocí počítače do 5 minut/.
                          </p>
                          <p className="mb-3">
                            Samotné měření příliš nezatěžuje klienta, ale během monitorace není vhodné větší pracovní vypětí, manuální práce /manžeta na paži částečně překáží/ ani dlouhé řízení motor. vozidla. Pokud se jedná o těžce manuálně pracujícího klienta, bude možné "navěšení" přístroje provést v pátek.
                          </p>
                          <p>
                            Jedná se o poměrně drahý přístroj, proto prosím o odpovídající zacházení. Věřím, že použití této metody přispěje k lepší korekci Vašich krevních tlaků a tím se podstatně sníží Vaše kardiovaskulární riziko.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Occupational health care */}
              <Element name="pracovnelekarska-pece">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center mb-6">
                        <Building2 className="w-6 h-6 text-primary-500 mr-3" />
                        <h2 className="text-2xl font-semibold">Pracovnělékařská péče</h2>
                      </div>
                      <p>
                        K prohlídce musíme mít s sebou vždy žádost o prohlídku a výpis ze zdravotní dokumentace od svého praktika.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Element>

              {/* Appointment */}
<Element name="objednavani">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="scroll-mt-24"
  >
    <div className="card">
      <div className="card-body">
        {/* Section Header */}
        <div className="flex items-center mb-6">
          <CalendarCheck className="w-6 h-6 text-primary-500 mr-3" />
          <h2 className="text-2xl font-semibold">Objednávání k vyšetření</h2>
        </div>

        {/* Description */}
        <p className="mb-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>Online objednávání je určeno pro běžné vyšetření, které dále rozšiřujeme i o další vyšetření, jako je <strong>prevence</strong> a <strong>závodní péče</strong>.</li>
            <li>Po vytvoření rezervace obdržíte potvrzovací email s odkazem na její zrušení (nejpozději 24 hodin před termínem).</li>
          </ul>
        </p>

        {/* Important Note */}
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex items-start">
          <CheckCircle className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-primary-800">
            <strong>Pro delší vyšetření</strong> telefonicky kontaktujte sestru a domluvte individuální čas.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-6 flex justify-center">
          <a href="/objednani" className="btn btn-primary inline-flex items-center">
            Online objednání
            <MoveRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </motion.div>
</Element>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrdinacePage;