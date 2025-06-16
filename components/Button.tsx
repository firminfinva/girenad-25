import { ButtonProps } from "@types";

const Button: React.FC<ButtonProps> = ({ styles, text = "Get Started" }) => {
  return (
    <button
      type="button"
      className={`${styles} py-2 px-4 bg-blue-gradient font-poppins font-medium text-[12px] text-primary outline-none rounded-[10px] hover:translate-x-2  transition-all ease-linear cursor-pointer`}
    >
      {text}
    </button>
  );
};

export default Button;
