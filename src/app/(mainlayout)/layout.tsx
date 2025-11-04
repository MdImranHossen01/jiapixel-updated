import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="grow">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Mainlayout;
