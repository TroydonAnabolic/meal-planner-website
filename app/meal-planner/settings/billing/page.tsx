import BudgetPreferencesSection from "@/app/components/client/billing/budget-contraints";
import { auth } from "@/auth";
import { getClient } from "@/lib/client/client";
import { initializeClientSettings } from "@/util/client-settings-util";

type Props = {};

const BillingPage = async (props: Props) => {
  const session = await auth();
  const clientData = await getClient(session?.user.userId as string);
  initializeClientSettings(clientData);
  return (
    <>
      <BudgetPreferencesSection clientData={clientData} />
    </>
  );
};
export default BillingPage;
