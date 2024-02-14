import styles from "./Auth.module.css";
import OrderImg from "../../assets/restaurantorder.png";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Logo } from "../../components/Logo/Logo";
import UserService from "../../services/UserService/user.service";
import { useUserStore } from "../../states/user.state";
import { Loader2 } from "lucide-react";

export const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { authenticate, setLoggedUser } = useUserStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const instanceOfUserService = new UserService();

    const data = {
      email,
      password,
    };

    const response = await instanceOfUserService.login(data);

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 401) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 200) {
      toast.info(response.data.message, {
        theme: "dark",
      });

      setLoggedUser(response.data.auth.user);
      authenticate(response.data.auth.token, response.data.auth.userId);
      navigate("/unities");
    }

    setLoading(false);
  };

  return (
    <div className={styles.align_all}>
      <section className={styles.container}>
        <section
          className={`${styles.order_img}`}
          style={{
            backgroundImage: `url(${OrderImg})`,
          }}
        >
          <Logo size="2em" />
        </section>
        <section className={styles.main_content}>
          <div className={styles.header}>
            <Logo size="1.7em" />
            <h2>Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              autoComplete="off"
              required
              type="text"
              placeholder="Email"
              className={styles.input_auth}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              autoComplete="off"
              required
              type="password"
              placeholder="Senha"
              className={styles.input_auth}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className={styles.button_submit}
              disabled={loading}
              type="submit"
            >
              <>
                {loading ? <Loader2 className="animate-spin" /> : <>Entrar</>}
              </>
            </button>
          </form>
          <section className={styles.link_section}>
            <p>
              <Link to={"/forgot/password"}>Esqueci minha senha</Link>
            </p>
            <p>
              Não tem uma conta? <Link to={"/register"}>Cadastre-se</Link>
            </p>
          </section>
        </section>
        <div></div>
      </section>
    </div>
  );
};
