import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-6">
          Odin drømmen
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
          Vi startet med et mål: å lage god sjokolade.
          Vi er et team på 5 mennesker som strever for å nå det målet hver eneste dag.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-96">
            <Image
              src="/images/chocolate-making.jpg"
              alt="Chocolate making process"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl text-stone-900 mb-6">
              Vårt oppdrag
            </h2>
            <p className="text-stone-600 mb-6">
            Vi lager norsk sjokolade direkte fra kakaobønner som vi importerer fra sør og mellom Amerika. All vår sjokolade blir laget i Hof på vår lille sjokoladefabrikk.
            </p>
            <p className="text-stone-600">
            Vi holder oss selv høyt slik at sjokoladen aldri skuffer, vi bruker de beste råvarene og kvalitetssikrer flere ganger underveis for å forsikre oss om at kundene våres blir fornøyd.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-stone-100 rounded-2xl p-12 mb-24">
          <h2 className="font-display text-3xl text-stone-900 text-center mb-12">
            Våre verdier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-2">Kvalitet</h3>
              <p className="text-stone-600">
                Som Odin, produserer vi sjokolade rett fra hjertet vårt.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-2">Bærekraft</h3>
              <p className="text-stone-600">
                Som Yggdrasil&apos;s røtter, opprettholder vi sterke koblinger med bærekraftige landbrukspraksis.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-2">Innovasjon</h3>
              <p className="text-stone-600">
                Som Odin&apos;s uendelige søk etter kunnskap, utforsker vi nye smaker og teknikker.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl text-stone-900 mb-12">
            Teamet vårt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/team-1.jpg"
                  alt="Daglig leder"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-1">
                Martin Henriksen
              </h3>
              <p className="text-stone-600">Daglig leder</p>
            </div>
            <div>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/team-2.jpg"
                  alt="Salgssjef"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-1">
                Kristoffer Horntveth Klausen
              </h3>
              <p className="text-stone-600">Salgssjef</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 