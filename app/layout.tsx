import "@/styles/globals.css";
import { Navbar } from "@components";
import styles from "@styles/style";
export const metadata = {
  title: "girenad",
  description: "girenad",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
