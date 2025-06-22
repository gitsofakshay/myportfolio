'use client';

import Head from 'next/head';

import AboutMe from './aboutme/page';
import Projects from './projects/page';
import Experience from './experience/page';
import Skills from './skills/page';
import Education from './education/page';
import Certifications from './certifications/page';
import Resume from './resume-cv/page';
import Contact from './contact/page';

export default function Home() {
  return (
    <>
      <Head>
        <title>Akshay | Full Stack Developer</title>
        <meta
          name="description"
          content="Portfolio of Akshay Kushwaha - Full Stack Developer specializing in React, Node.js, and MongoDB."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white px-2 sm:px-4 md:px-10 lg:px-20 space-y-16 md:space-y-24 flex flex-col items-center w-full">
        <section className="w-full max-w-7xl">
          <AboutMe />
        </section>
        <section className="w-full max-w-7xl">
          <Projects />
        </section>
        <section className="w-full max-w-7xl">
          <Experience />
        </section>
        <section className="w-full max-w-7xl">
          <Skills />
        </section>
        <section className="w-full max-w-7xl">
          <Education />
        </section>
        <section className="w-full max-w-7xl">
          <Certifications />
        </section>
        <section className="w-full max-w-7xl">
          <Resume />
        </section>
        <section className="w-full max-w-7xl">
          <Contact />
        </section>
      </main>
      
    </>
  );
}
