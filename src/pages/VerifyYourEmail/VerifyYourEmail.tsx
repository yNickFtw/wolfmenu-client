import { useEffect } from "react";
import styles from "./VerifyYourEmail.module.css";
import { useUserStore } from "../../states/user.state";
import { Link, useNavigate } from "react-router-dom";

export const VerifyYourEmail = () => {
  const { isLoggedIn } = useUserStore();
  

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <section className={styles.container}>
      <header className={styles.header_section}>
        <h1>
          Wolf<span style={{ color: "#EC0D35" }}>Menu</span>
        </h1>

        <Link to={'/login'} className={styles.link_login}>Entrar</Link>
      </header>
      <div className={styles.main_content}>
        <section className={styles.verification_required}>
          <h2>Verificação de E-mail Necessária</h2>
          <p>
            Verifique seu e-mail para garantir a segurança da sua conta. Siga o
            link de verificação para confirmar sua identidade. Dúvidas? Contate
            nossa equipe de suporte. Agradecemos!
          </p>
          <p>
            Não se esqueça de checar a caixa de{" "}
            <span style={{ color: "#EC0D35" }}>SPAM</span>
          </p>
        </section>
        <section className={styles.didnt_receive_section}>
          <h3>Não recebeu o email?</h3>
          <button className={styles.request_email_button}>Receber outro link de verificação</button>
        </section>
      </div>
      <div></div>
      <div></div>
    </section>
  );
};
