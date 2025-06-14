import styles from "@/styles/style";

const Contact: React.FC = () => (
  <section
    className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} flex flex-col lg:flex-row gap-10 bg-white/5 backdrop-blur-md rounded-[20px] shadow-xl border border-white/10`}
  >
    {/* Formulaire de contact */}
    <div className="flex-1 w-full text-white">
      <h2 className={`${styles.heading2} text-3xl md:text-4xl mb-4`}>
        Contactez-nous
      </h2>
      <p className={`${styles.paragraph} max-w-[500px] mb-8`}>
        Nous sommes à votre disposition. Réponse garantie sous 48h.
      </p>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Votre nom" className="input-style" />
          <input
            type="email"
            placeholder="Votre email"
            className="input-style"
          />
          <input type="tel" placeholder="Téléphone" className="input-style" />
          <input type="text" placeholder="Objet" className="input-style" />
        </div>
        <textarea
          placeholder="Votre message"
          rows={5}
          className="input-style w-full"
        />
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300"
        >
          Envoyer
        </button>
      </form>
    </div>

    {/* Contact rapide */}
    <div className="w-full max-w-sm bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 p-8 rounded-2xl shadow-2xl text-white flex flex-col justify-between text-center space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Contact Rapide</h3>
        <p className="text-base text-white/90">
          Vous avez une question urgente ? Appelez-nous directement :
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg
            className="w-6 h-6 text-yellow-300 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5h12M9 3v2m0 4v2m0 4v2m0 4v2m5-10h3a2 2 0 012 2v8a2 2 0 01-2 2h-3m-6 0H6a2 2 0 01-2-2v-8a2 2 0 012-2h3"
            />
          </svg>
          <a
            href="tel:+243994261583"
            className="text-lg font-semibold underline hover:text-yellow-300 transition"
          >
            +243 994 261 583
          </a>
        </div>

        <div className="flex items-center justify-center gap-3">
          <svg
            className="w-6 h-6 text-yellow-300 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5h12M9 3v2m0 4v2m0 4v2m0 4v2m5-10h3a2 2 0 012 2v8a2 2 0 01-2 2h-3m-6 0H6a2 2 0 01-2-2v-8a2 2 0 012-2h3"
            />
          </svg>
          <a
            href="tel:+243998054815"
            className="text-lg font-semibold underline hover:text-yellow-300 transition"
          >
            +243 998 054 815
          </a>
        </div>
      </div>

      {/* Bouton WhatsApp */}
      <a
        href="https://wa.me/243994261583"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-4 bg-green-500 hover:bg-green-600 transition text-white rounded-lg text-sm font-medium shadow-lg"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.5 3.5A11.99 11.99 0 0012 1C6.48 1 2 5.48 2 11a10.97 10.97 0 001.6 5.6L2 22l5.6-1.6A10.97 10.97 0 0012 21c6.52 0 11-4.48 11-10.5 0-2.9-1.2-5.6-3.5-7zM12 19a8.42 8.42 0 01-4.5-1.3l-.3-.2-3.3.9.9-3.3-.2-.3A8.42 8.42 0 015 11c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.1-6.6c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.8c-.1.1-.3.2-.6.1s-1.1-.4-2-1.2c-.7-.6-1.2-1.4-1.3-1.6s0-.4.1-.5c.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1.1-.3 0-.4s-.5-1.3-.7-1.8c-.2-.5-.4-.4-.5-.4H8.1c-.1 0-.3 0-.4.2-.1.1-.6.5-.6 1.2s.6 1.4.7 1.5c.1.1 1.2 1.8 2.8 2.5 1.6.8 2.4.7 2.8.7.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1z" />
        </svg>
        Discuter sur WhatsApp
      </a>

      <div className="text-sm text-white/70 mt-2">
        Disponible du lundi au vendredi, de 8h à 17h.
      </div>
    </div>
  </section>
);

export default Contact;
