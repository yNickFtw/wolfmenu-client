// LayoutWithSidebar.jsx

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar"; // Importe o componente Sidebar aqui

interface IProps {
  children: ReactNode;
}

const LayoutWithSidebar = ({ children }: IProps) => {
    const [isDesktop, setDesktopValue] = useState<boolean>(isDesktopFunction());
  
    function isDesktopFunction(): boolean {
      return window.innerWidth >= 768;
    }
  
    useEffect(() => {
      const handleResize = () => {
        setDesktopValue(isDesktopFunction());
      };
  
      console.log("RESIZE")

      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

  return (
      <Sidebar>
        {children}
      </Sidebar>
  );
};

export default LayoutWithSidebar;
