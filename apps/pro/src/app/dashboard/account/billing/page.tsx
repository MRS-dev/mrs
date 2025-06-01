"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const AccountBilling: React.FC = () => {
  // const { isSubscribed, prices, customerId } = useSubscription();

  // const handleSubscription = async (price: any) => {
  //   try {
  //     const { data } = await client.post("/stripe/checkout-session", {
  //       customerId: customerId,
  //       priceId: price.id,
  //     });

  //     window.location.href = data.session.url;
  //   } catch (error) {
  //     console.error("Error creating customer portal session:", error);
  //     alert("Une erreur est survenue.");
  //   }
  // };

  // const handleRedirect = async () => {
  //   try {
  //     const { data } = await client.post("/stripe/customer-portal", {
  //       customerId: customerId,
  //     });

  //     window.location.href = data.url;
  //   } catch (error) {
  //     console.error("Error creating customer portal session:", error);
  //     alert("Une erreur est survenue.");
  //   }
  // };

  // if (!isSubscribed) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.containerList}>
  //         {prices.map((price: any) => (
  //           <div
  //             key={price.id}
  //             onClick={() => handleSubscription(price)}
  //             className={styles.card}
  //           >
  //             <div className={styles.title}>{price.product.name}</div>
  //             <div className={styles.priceContainer}>
  //               <div className={styles.price}>
  //                 {price.subscription.formatted_price}
  //                 {price.subscription.currency}
  //               </div>
  //               <div className={styles.period}>
  //                 /{price.subscription.period}
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Button variant="default" size="lg">
        Gérer mon abonnement
      </Button>
    </div>
  );
};

export default AccountBilling;
