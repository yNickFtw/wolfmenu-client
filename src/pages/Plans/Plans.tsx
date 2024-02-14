import React, { useState, useEffect } from "react";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import PlanService from "../../services/PlanService/plan.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IPlan } from "../../shared/IPlan";
import styles from "./Plans.module.css";
import { useUserStore } from "../../states/user.state";
import StripeService from "../../services/StripeService/stripe.service";

export const Plans = () => {
  const [plans, setPlans] = useState<IPlan[] | []>([]);
  const { loggedUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>();
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  const planService = new PlanService();
  const stripeService = new StripeService();
  const navigate = useNavigate();

  const selectPlanToSubscribe = async (id: string) => {
    setSelectedPlan(id);
    setLoading(true);


    const token = localStorage.getItem("token") as string;

    const response = await stripeService.createSession(token!, id)

    if(response.statusCode === 201) {
      window.location.href = response.data.session
    }

  }

  useEffect(() => {
    async function fetchAllPlans() {
      const response = await planService.fetchAllPlans();

      if (response.statusCode === 500) {
        toast.error(response.data.message, {
          theme: "dark",
        });
        navigate("/");
      }

      if (response.statusCode === 200) {
        setPlans(response.data);
      }
    }

    fetchAllPlans();
  }, []);

  return (
    <LayoutWithSidebar>
      <h2 className={styles.title}>Todos os Planos</h2>

      <div className={styles.container}>
        {loggedUser.planUser &&
          loggedUser.planStatus === "ACTIVE" &&
          loggedUser.planUser !== "Essential" && (
            <h1>Seu plano {loggedUser.planUser}</h1>
          )}
        {plans &&
          loggedUser.planUser === "Essential" &&
          plans.map((plan: IPlan) => (
            <div
              className={`${styles.plan_card} ${
                plan.name === "Premium" ? styles.premium_card : ""
              }`}
              key={plan.id}
            >
              <div className={styles.plan_header}>
                <h2 className={styles.plan_name}>{plan.name}</h2>
                <div className={styles.price}>{plan.price.replace('.', ',')}</div>
              </div>
              <ul className={styles.advantages_list}>
                <li>Limite de unidades: {plan.quantityLimitUnities}</li>
                <li>Limite por categoria: {plan.quantityLimitCategory}</li>
                <li>Limite por produto: {plan.quantityLimitProduct}</li>
                <li>Limite de links: {plan.quantityLimitLinks}</li>
              </ul>
              {plan.name !== "Essential" && (
                <button className={styles.subscribe_button} disabled={loading && selectedPlan === plan.stripeId ? true : false} onClick={() => selectPlanToSubscribe(plan.stripeId)}>
                  {!loading && selectedPlan !== plan.stripeId && <>Assinar Agora</>}
                  {loading && selectedPlan === plan.stripeId && <>Aguarde...</>}
                  {loading && selectedPlan !== plan.stripeId && <>Assinar Agora</>}
                </button>
              )}
            </div>
          ))}
      </div>
    </LayoutWithSidebar>
  );
};
