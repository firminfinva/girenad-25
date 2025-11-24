"use client";
import "@/styles/globals.css";
import { Navbar } from "@components";
import styles from "@styles/style";
import { AuthProvider } from "@/contexts/AuthContext";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Navbar />
            </div>
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
