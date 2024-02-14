import { FormEvent, useState } from "react";
import styles from "./Auth.module.css";
import OrderImg from "../../assets/restaurantorder.png";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService/user.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo/Logo";
import { Loader2 } from "lucide-react";

export const Register = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    const response = await new UserService().register(data);

    if (response) {
      if (response.statusCode === 400) {
        toast.error(response.data.message, {
          theme: "dark",
        });

          setLoading(false);
      }

      if (response.statusCode === 500) {
        toast.error(response.data.message, {
          theme: "dark",
        });

          setLoading(false);
      }

      if (response.statusCode === 201) {
        toast.info(response.data.message, {
          theme: 'dark'
        });

        navigate("/verify/your/email");

        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.align_all}>
      <section className={styles.container}>
        <section
          className={styles.order_img}
          style={{
            backgroundImage: `url(${OrderImg})`,
          }}
        >
          <Logo size="2em" />
        </section>
        <section className={styles.main_content}>
          <div className={styles.header}>
          <Logo size="1.7em"/>
            <h2>Cadastro</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              autoComplete="off"
              required
              type="text"
              placeholder="Primeiro nome"
              className={styles.input_auth}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              autoComplete="off"
              required
              type="text"
              placeholder="Último nome"
              className={styles.input_auth}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              autoComplete="off"
              required
              type="email"
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
            <input
              autoComplete="off"
              required
              type="password"
              placeholder="Confirme a senha"
              className={styles.input_auth}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className={styles.button_submit} disabled={loading}>
              {loading ? <>
                <Loader2 className="animate-spin" />
              </> : <>Criar conta</>}
            </button>
          </form>
          <section className={styles.link_section}>
            <p>
              Já tem uma conta? <Link to={"/login"}>Faça login</Link>
            </p>
          </section>
        </section>
        <div></div>
      </section>
    </div>
  );
};
