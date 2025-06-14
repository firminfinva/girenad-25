import { feedback } from "@/constants";
import styles from "@/styles/style";
import Programme from "./Programme";
const Theprograms: React.FC = () => (
  <section
    id="clients"
    className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
  >
    <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient" />
    <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-10 mb-6 relative z-[1]">
      <h1 className={styles.heading2}>LE PROGRAMME</h1>
    </div>
    <div className="flex flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1]">
      {feedback.map((card) => (
        <Programme key={card.id} {...card} />
      ))}
    </div>
  </section>
);

export default Theprograms;
