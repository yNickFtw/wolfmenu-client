import { useEffect, useState } from "react";
import styles from "./VerifyEmail.module.css";
import { useUserStore } from "../../states/user.state";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService/user.service";
import { toast } from "react-toastify";

export const VerifyEmail = () => {
  const { isLoggedIn } = useUserStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(2);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const userService = new UserService();

  function navigateToVerifyYourEmail() {
    navigate("/verify/your/email");
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }

    async function verifyEmailUser() {
      const token = params.get("token")!;

      if (!token) {
        toast.error("O token não foi informado pela URL!", {
          theme: "dark",
        });

        navigateToVerifyYourEmail();
      }

      const response = await userService.verifyUserEmail(token);

      if (response.statusCode === 401 || response.statusCode === 400 || response.statusCode === 404) {
        toast.error(response.data.message, {
          theme: "dark",
        });

        navigateToVerifyYourEmail();
      }

      if (response.statusCode === 302) {
        toast.error(response.data.message, {
          theme: "dark",
        });

        navigate('/login')
      }

      if (response.statusCode === 200) {
        toast.info(response.data.message, {
          theme: "dark",
        });

        setLoading(false);

        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          navigate("/login");
        }, 2000);
      }
    }

    verifyEmailUser();
  }, []);

  return (
    <section className={styles.container}>
      <header className={styles.header_section}>
        <h1>
          Wolf<span style={{ color: "#EC0D35" }}>Menu</span>
        </h1>

        <Link to={"/login"} className={styles.link_login}>
          Entrar
        </Link>
      </header>
      <div className={styles.main_content}>
        <h2 style={{ textAlign: "center" }}>Verificação de email</h2>
        {loading && (
          <h4 style={{ textAlign: "center" }}>Verificação em andamento...</h4>
        )}

        {!loading && (
          <h2 style={{ textAlign: "center" }}>Sucesso, em {countdown} segundos você será redirecionado</h2>
        )}
      </div>
      <div></div>
      <div></div>
    </section>
  );
};
