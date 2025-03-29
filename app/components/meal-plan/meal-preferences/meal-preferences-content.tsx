import MealPreferencesSection from "@/app/components/meal-plan/meal-preferences/meal-preferences";
import { getClient } from "@/lib/server-side/client";
import { auth } from "@/auth";

type MealPreferencesContentProps = {};

const MealPreferencesContent: React.FC<MealPreferencesContentProps> = async () => {
    const session = await auth();
    const clientData = await getClient(session?.user.userId as string);

    return <MealPreferencesSection clientData={clientData} />;
};

export default MealPreferencesContent;