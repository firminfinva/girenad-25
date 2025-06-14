"use client";
import styles from "@/styles/style";
import { Navbar, Hero, Stats, Business, CardDeal, Footer } from "@/components";
import Contact from "@components/Contact";
import Partenaire from "@components/Partenaire";
import Theprograms from "@components/Theprograms";
import TheOdd from "@components/TheOdd";
const Home: React.FC = () => {
  return (
    <>
      <div className="bg-white w-full overflow-hidden">
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero />
          </div>
        </div>
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Stats />
          </div>
        </div>
        <div className={`bg-slate-700 ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Business />
          </div>
        </div>
        <div className={`bg-white ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <TheOdd />
          </div>
        </div>
        <div
          className={`bg-slate-400 ${styles.paddingX} ${styles.flexStart}`}
          style={{
            background: "linear-gradient(to bottom, white, slategray)",
          }}
        >
          <div className={`${styles.boxWidth}`}>
            <CardDeal />
          </div>
        </div>
        <div
          className={`bg-teal-900 ${styles.paddingX} ${styles.flexStart} bg-[url('/assets/bg1.jpg')] bg-cover bg-center `}
        >
          <div className={`${styles.boxWidth}`}>
            <Theprograms />
          </div>
        </div>
        <div className={`bg-white ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            {/* <CardDeal /> */}
            <Partenaire />
          </div>
        </div>
        <div
          className={`bg-primary ${styles.paddingX} ${styles.flexStart} bg-[url('/assets/bg4.jpg')] bg-cover bg-center `}
        >
          <div className={`${styles.boxWidth}`}>
            {/* <CardDeal /> */}

            <Contact />
          </div>
        </div>
        <div className={`bg-slate-200 ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
