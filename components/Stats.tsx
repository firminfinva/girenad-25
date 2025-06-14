import styles from "@/styles/style";
import { stats } from "@/constants";
const Stats: React.FC = () => (
  <div className={`sm:px-16 px-6 `}>
    <p className="text-white p-[20px] font-extrabold xs:text-[26px] text-[21px]">
      LES FAITS & LES CHIFFRES
    </p>

    <section
      className={`flex pb-[20px] ss:gap-[1%]  gap-[30px] flex-row flex-wrap sm:mb-20 mb-6`}
    >
      {stats.map((stat) => (
        <div key={stat.id} className={`ss:w-[24%]  h-auto`}>
          <div className="w-[100%] h-auto ">
            <span className="text-slate-400"></span>
            <h4 className="font-poppins font-semibold xs:text-[45px] text-[53px] xs:leading-[40px] leading-[43px] text-white">
              {stat.value}
            </h4>
            <p className="font-poppins font-normal xs:text-[9px] text-[20px] xs:leading-[26px] leading-[21px] text-gradient uppercase ml-3">
              {stat.title}
            </p>
            <div className="flex flex-col">
              <span className="text-slate-300 xs:text-[9px] text-[15px]">
                {stat.describe1}
              </span>
              <span className="text-slate-300 xs:text-[9px] text-[15px]">
                {stat.describe2}
              </span>
            </div>
          </div>
          {/* <div>
            <span className="text-slate-400"></span>
            <h4 className="font-poppins font-semibold xs:text-[10px] text-[15px] xs:leading-[53px] leading-[43px] text-white">
              {stat.value}
            </h4>
            <p className="font-poppins font-normal xs:text-[20px] text-[20px] xs:leading-[26px] leading-[21px] text-gradient uppercase ml-3">
              {stat.title}
            </p>
            <br />
            <span className="text-slate-300 text-[10px]">{stat.describe1}</span>
            <span className="text-slate-300 text-[10px]">{stat.describe2}</span>
          </div> */}
        </div>
      ))}
    </section>
  </div>
);

export default Stats;
