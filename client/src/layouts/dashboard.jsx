import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const authContext = useContext(AuthContext);
  const [sideNavRoutes, setSideNavRoutes] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidenav, setShowSidenav] = useState(true)

  const boxRef = useRef()

  // useEffect(() => {
  //   window.onclick = (event) => {
  //     if (event.target.contains(boxRef.current)
  //       && event.target !== boxRef.current) {
  //       setShowSidenav(false);
  //       console.log(`You clicked Outside the box at ${new Date().toLocaleString()}`);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    let tempRoutes = [];


    routes.map((item) => {
      if (localStorage.getItem("role").includes(item.role)) tempRoutes.push(item);
    });
    setSideNavRoutes(tempRoutes);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize isMobile value

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      {/* {showSidenav && ( */}
        <div ref={boxRef}>
          <Sidenav
            isMobile={isMobile}
            routes={sideNavRoutes}
            brandImg={sidenavType === "dark" ? "/img/logo.png" : "/img/logo.png"}
          // onClose={() => isMobile && setOpenSidenav(dispatch, false)}
          />
        </div>
      {/* )} */}


      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              (layout === "dashboard" || layout === "other") &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;