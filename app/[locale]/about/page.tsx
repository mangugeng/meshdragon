import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function About({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('About');

  const teamMembers = [
    {
      key: 'founder',
      image: '/team/founder.jpg',
      gradient: 'from-purple-500 to-pink-500',
      linkedin: 'https://linkedin.com/in/mangugeng',
      github: 'https://github.com/mangugeng',
      expertise: ['Web Development', '3D Graphics', 'Business Strategy']
    },
    {
      key: 'tech',
      image: '/team/tech.jpg',
      gradient: 'from-blue-500 to-cyan-500',
      linkedin: 'https://linkedin.com/in/demidasmana',
      github: 'https://github.com/demidasmana',
      expertise: ['WebGL', 'Three.js', 'Performance Optimization']
    },
    {
      key: 'design',
      image: '/team/design.jpg',
      gradient: 'from-green-500 to-emerald-500',
      linkedin: 'https://linkedin.com/in/rakeumuladi',
      github: 'https://github.com/rakeumuladi',
      expertise: ['UI/UX Design', '3D Interface', 'Motion Design']
    }
  ];

  return (
    <main className="min-h-screen bg-[#000308] text-white pt-20">
      {/* Vision Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {t('vision.title')}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {t('vision.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {['innovation', 'accessibility', 'community'].map((key) => (
              <div 
                key={key} 
                className="card-gradient p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  {t(`vision.values.${key}.title`)}
                </h3>
                <p className="text-gray-300">
                  {t(`vision.values.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
              {t('team.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('team.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.key}
                className="group relative overflow-hidden rounded-xl aspect-square bg-gradient-to-b from-transparent to-black/80"
              >
                <Image
                  src={member.image}
                  alt={t(`team.members.${member.key}.name`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">
                    {t(`team.members.${member.key}.name`)}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {t(`team.members.${member.key}.role`)}
                  </p>
                  <p className="text-sm text-gray-400 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(`team.members.${member.key}.bio`)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full bg-opacity-20 ${
                          member.gradient.split(' ')[1]
                        } text-white`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('contact.description')}
          </p>
          <a
            href="mailto:contact@meshdragon.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('contact.button')}
          </a>
        </div>
      </section>
    </main>
  );
} 