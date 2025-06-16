import styles from "@/styles/style";
import { logo } from "@/public/assets";
import { footerLinks, socialMedia } from "@/constants";
import thelogo from "@/public/assets/logo.png";
import Image from "next/image";

const Footer: React.FC = () => (
  <section className={`${styles.flexCenter} py-5 flex-col`}>
    <div className={`${styles.flexCenter} md:flex-row flex-col mb-8 w-full`}>
      <div className="flex-1 flex flex-col justify-start mr-10">
        <Image
          src={thelogo}
          alt="girenad"
          className="w-[150px] h-[150px] object-contain"
        />
        <p className="font-poppins font-normal text-black text-[12px] leading-[20.8px] mt-4 max-w-[310px]">
          Pour la gouvernance locale, les droits humains et la gestion durable
          des ressources naturelles en RDC
        </p>
        <br />
        <div className="flex flex-row md:mt-0 mt-6">
          {socialMedia.map((social, index) => (
            <Image
              src={social.icon}
              key={social.id}
              alt={social.id}
              className={`w-[21px] h-[21px] object-contain cursor-pointer ${
                index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
        {footerLinks.map((footerLink) => (
          <div
            key={footerLink.id}
            className="flex flex-col ss:my-0 my-4 min-w-[150px]"
          >
            <h4
              className={`font-poppins font-bold text-[18px] leading-[17px] text-black`}
            >
              {footerLink.title}
            </h4>
            <ul className="list-none mt-4">
              {footerLink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={`font-poppins font-normal text-[12px] leading-[15px] text-black hover:text-secondary cursor-pointer ${
                    index !== footerLink.links.length - 1 ? "mb-4" : "mb-0"
                  }`}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[12px] leading-[27px] text-black">
        © 2024 GIRENAD. Tous droits réservés.
      </p>
      <div className="flex flex-col md:mt-0 mt-6">
        <p className="font-poppins font-normal text-[12px] leading-[15px] text-black">
          Email: girenadsabl@gmail.com
        </p>
        <p className="font-poppins font-normal text-[12px] leading-[15px] text-black">
          Site: www.girenad.org
        </p>
        <p className="font-poppins font-normal text-[12px] leading-[15px] text-black">
          RDC
        </p>
      </div>
    </div>
  </section>
);

export default Footer;
