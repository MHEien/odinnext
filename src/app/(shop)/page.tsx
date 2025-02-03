'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { subscriptionPlans } from '@/lib/mock/subscriptions';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white px-4"
        >
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl mb-6">
            Odin Chocolate
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Opplev den guddommelige smaken av norsk sjokolade,
            laget med de fineste råvarene og gamle kunnskaper.
          </p>
          <Link
            href="/products"
            className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
          >
            Utforsk våre produkter
          </Link>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-stone-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4">Fremhevede produkter</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Utforsk våre mest elskede sjokolader, alle inspirert av
              nordiske myter og laget til perfektion.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Thor's Thunder */}
            <motion.div
              variants={itemVariants}
              className="card group hover:scale-105 transition-transform"
            >
              <div className="aspect-square bg-[url('/images/thor-thunder.jpg')] bg-cover bg-center rounded-t-lg" />
              <div className="p-6">
                <h3 className="font-display text-2xl mb-2">Thor&apos;s Torden</h3>
                <p className="text-stone-600 mb-4">
                  Mørk sjokolade med havsalt og popping kjeks, inspirert av
                  den gud som torden.
                </p>
                <Link href="/products/thor-torden" className="btn-secondary w-full">
                  Lær mer
                </Link>
              </div>
            </motion.div>

            {/* Freya's Fusion */}
            <motion.div
              variants={itemVariants}
              className="card group hover:scale-105 transition-transform"
            >
              <div className="aspect-square bg-[url('/images/freya-fusion.jpg')] bg-cover bg-center rounded-t-lg" />
              <div className="p-6">
                <h3 className="font-display text-2xl mb-2">Freya&apos;s Fusion</h3>
                <p className="text-stone-600 mb-4">
                  Hvete sjokolade med roser og honning, så smakfulle og
                  magiske som gudinnen Freya.
                </p>
                <Link href="/products/freya-fusion" className="btn-secondary w-full">
                  Lær mer
                </Link>
              </div>
            </motion.div>

            {/* Odin's Wisdom */}
            <motion.div
              variants={itemVariants}
              className="card group hover:scale-105 transition-transform"
            >
              <div className="aspect-square bg-[url('/images/odin-wisdom.jpg')] bg-cover bg-center rounded-t-lg" />
              <div className="p-6">
                <h3 className="font-display text-2xl mb-2">Odin&apos;s Wisdom</h3>
                <p className="text-stone-600 mb-4">
                  72% mørk sjokolade med kaffe og gamle krydder,
                  som gir klarhet og innsikt.
                </p>
                <Link href="/products/odin-visdom" className="btn-secondary w-full">
                  Lær mer
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4">Bli en del av vårt legendariske fellesskap</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Abonner på regelmessige leveringer av våre guddommelige sjokolader og
              bli en del av vår legendariske fellesskap.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {subscriptionPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className="card group hover:scale-105 transition-transform"
              >
                <div className="p-8">
                  <h3 className="font-display text-2xl mb-2">{plan.name}</h3>
                  <p className="text-stone-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      ${plan.pricePerDelivery}
                    </span>
                    <span className="text-stone-600">
                      {' '}
                      per {plan.frequency} levering
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-6 h-6 text-primary-600 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/subscriptions/${plan.id}/checkout`}
                    className="btn-primary w-full"
                  >
                    Abonner nå
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-primary-900 text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="font-display text-4xl mb-6"
          >
            Start din sjokoladereise
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl mb-8">
            Bli en del av vårt legendariske fellesskap og opplev den guddommelige smaken av norsk sjokolade.
            Hver smak forteller en historie.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/products"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              Utforsk alle produkter
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
