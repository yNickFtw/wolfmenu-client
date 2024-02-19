import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Register } from "./pages/Auth/Register";
import { useUserStore } from "./states/user.state";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Login } from "./pages/Auth/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VerifyYourEmail } from "./pages/VerifyYourEmail/VerifyYourEmail";
import { useEffect } from "react";
import UserService from "./services/UserService/user.service";
import { Unities } from "./pages/Unities/Unities";
import { Account } from "./pages/Account/Account";
import { VerifyEmail } from "./pages/VerifyEmail/VerifyEmail";
import { Plans } from "./pages/Plans/Plans";
import { Successfully } from "./pages/Successfully/Successfully";
import { Categories } from "./pages/Categories/Categories";
import { Products } from "./pages/Products/Products";
import { Links } from "./pages/Links/Links";
import { Menu } from "./pages/Menu/Menu";
import { CreateProduct } from "./pages/CreateProduct/CreateProduct";
import { unitUseStore } from "./states/unit.states";
import { CreateMenu } from "./pages/CreateMenu/CreateMenu";

function App() {
  const { isLoggedIn, logout, setLoggedUser } = useUserStore();
  const { setSelectedUnit } = unitUseStore();

  useEffect(() => {
    async function fetchLoggedUser() {
      const token = localStorage.getItem("token") as string;

      if (isLoggedIn) {
        const response = await new UserService().fetchLoggedUser(token);

        if (response.statusCode === 401) {
          toast.error(response.data.message, {
            theme: "dark",
          });

          logout();
        }

        if (response.statusCode === 200) {
          setLoggedUser(response.data);
        }
      }
    }

    fetchLoggedUser();
  }, []);

  return (
    <>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route
              path="/register"
              element={isLoggedIn ? <Dashboard /> : <Register />}
            />
            <Route
              path="/login"
              element={isLoggedIn ? <Dashboard /> : <Login />}
            />
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login />} />
            <Route
              path="/verify/your/email"
              element={isLoggedIn ? <Dashboard /> : <VerifyYourEmail />}
            />
            <Route
              path="/verify/email"
              element={isLoggedIn ? <Dashboard /> : <VerifyEmail />}
            />
            <Route
              path="/unities"
              element={isLoggedIn ? <Unities /> : <Login />}
            />
            <Route
              path="/categories"
              element={isLoggedIn ? <Categories /> : <Login />}
            />
            <Route
              path="/products"
              element={isLoggedIn ? <Products /> : <Login />}
            />
            <Route
              path="/create/product"
              element={isLoggedIn ? <CreateProduct /> : <Login />}
            />
            <Route
              path="/menu"
              element={isLoggedIn ? <Menu /> : <Login />}
            />
            <Route
              path="/create/menu"
              element={isLoggedIn ? <CreateMenu /> : <Login />}
            />
            <Route
              path="/links"
              element={isLoggedIn ? <Links /> : <Login />}
            />
            <Route
              path="/account"
              element={isLoggedIn ? <Account /> : <Login />}
            />
            <Route path="/plans" element={isLoggedIn ? <Plans /> : <Login />} />
            <Route
              path="/success/thanks"
              element={isLoggedIn ? <Successfully /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
