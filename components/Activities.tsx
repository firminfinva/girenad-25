import { activities } from "@/constants/activities";
import styles from "@/styles/style";
import ActivityCard from "./ActivityCard";

const Activities: React.FC = () => (
  <section
    id="activities"
    className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
  >
    <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient" />
    <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-10 mb-6 relative z-[1]">
      <h1 className={`${styles.heading2} text-black md:text-black`}>
        NOS ACTIVITÉS
      </h1>
    </div>
    <div className="flex flex-wrap sm:justify-start gap-4 justify-center w-full feedback-container relative z-[1]">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} {...activity} />
      ))}
    </div>
  </section>
);

export default Activities;
