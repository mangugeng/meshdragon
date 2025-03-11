import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/app/[locale]/components/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black/50">
      <div className="text-white">Loading 3D Model...</div>
    </div>
  )
})

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#000308]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="hero-glow top-1/4 left-1/4 animate-pulse" />
        <div className="hero-glow bottom-1/4 right-1/4 animate-pulse delay-1000" />
        <div className="absolute inset-0 z-0">
          <ModelViewer
            modelId="2bc6a6d32e0747a2bf767fc094095f16"
            title="Space Hangar"
            author="Jayson Stauffer"
            authorUrl="https://sketchfab.com/jaysonstauffer"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
          <span className="text-sm font-semibold tracking-wider uppercase mb-4 inline-block gradient-text">
            Platform Web3D Terkini
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Jelajahi Dunia Digital
            <br />
            <span className="gradient-text">Tanpa Batas</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Hadirkan ide-ide kreatif Anda dalam bentuk visualisasi 3D yang memukau.
            Platform modern untuk kreator digital masa kini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="button-primary w-full sm:w-auto">
              Mulai Sekarang
            </button>
            <button className="button-secondary w-full sm:w-auto">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="hero-glow top-0 left-1/2 opacity-30" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-wider uppercase mb-4 inline-block gradient-text">
              Fitur Unggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Semua Yang Anda Butuhkan
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Platform lengkap dengan berbagai fitur canggih untuk membuat, mengedit,
              dan membagikan konten 3D Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Real-time 3D Editing",
                description: "Edit dan preview model 3D secara langsung di browser tanpa perlu software tambahan",
                icon: "🎨"
              },
              {
                title: "Performa Optimal",
                description: "Dioptimalkan untuk kinerja maksimal di semua perangkat dengan teknologi WebGL terkini",
                icon: "⚡"
              },
              {
                title: "Kolaborasi Tim",
                description: "Bekerja bersama tim Anda dalam waktu nyata dengan fitur kolaborasi yang powerful",
                icon: "👥"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="card-gradient p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="hero-glow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Siap Untuk Memulai?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bergabunglah dengan ribuan kreator digital yang telah menggunakan platform kami
          </p>
          <button className="button-primary text-lg px-10 py-4">
            Daftar Gratis
          </button>
        </div>
      </section>
    </main>
  )
} 