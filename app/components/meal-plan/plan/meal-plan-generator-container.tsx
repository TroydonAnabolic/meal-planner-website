"use client";
import { IClientInterface } from "@/models/interfaces/client/client";
import dayjs from "dayjs";
import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useReactToPrint, UseReactToPrintFn } from "react-to-print";
import MealPlanGenerator from "./meal-plan-generator";
import { ConfirmActionModalProps } from "../../ui/modals/confirm-action-modal";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { useSession } from "next-auth/react";

interface MealPlanGeneratorContainerProps {
    clientData: IClientInterface;
}

const MealPlanGeneratorContainer: React.FC<MealPlanGeneratorContainerProps> = ({
    clientData,
}) => {
    const [recipes, setRecipes] = useState<IRecipeInterface[]>([]);
    const [mealPlan, setMealPlan] = useState<IMealPlan | null>(null);
    const { data: session, status } = useSession();
    const componentRef = React.useRef(null);
    const [emailLoading, setEmailLoading] = useState(false);
    const [confirmModalProps, setConfirmModalProps] =
        useState<ConfirmActionModalProps>({
            open: false,
            title: "",
            message: "",
            confirmText: "",
            colorScheme: "",
            onConfirm: () => { },
            cancelText: "",
            onClose: () => { },
            type: "primary",
        });

    const handleAfterPrint = React.useCallback(() => {
        console.log("`onAfterPrint` called");
    }, []);

    const handleBeforePrint = React.useCallback(() => {
        console.log("`onBeforePrint` called");
        return Promise.resolve();
    }, []);

    const printFn: UseReactToPrintFn = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Meal Plan - ${dayjs().format(
            "DD/MM/YYYY"
        )} - ${clientData.Id} `,
        onAfterPrint: handleAfterPrint,
        onBeforePrint: handleBeforePrint,
    });

    const renderMealPlanToHTML = (mealPlanSection: any): string => {
        return ReactDOMServer.renderToStaticMarkup(mealPlanSection);
    };

    const handleEmailMealPlan = React.useCallback(async () => {
        const mealPlanHtml = renderMealPlanToHTML(GeneratorContainer());

        try {
            setEmailLoading(true);
            const response = await fetch("/api/email/meal-plan", {
                method: "POST",
                body: JSON.stringify({
                    mealPlanHtml,
                    mealPlans: [mealPlan],
                    recipes,
                    clientId: clientData.Id,
                    toEmail: session?.user.email,
                    givenName: session?.user.givenName,
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to send email");
            }

            setConfirmModalProps({
                open: true,
                title: "Meal plan emailed successfully!",
                message: "Meal plan emailed successfully!",
                confirmText: "OK",
                onConfirm: () => {
                    setConfirmModalProps({
                        ...confirmModalProps,
                        open: false,
                    });
                },
                cancelText: "",
                onClose: () => { },
                type: "primary",
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to email meal plan. Please try again later.");
        } finally {
            setEmailLoading(false);
        }
    }, [mealPlan, recipes, clientData, session]);



    const ActionButton = ({
        onClick,
        disabled = false,
        text,
        isLoading = false,
        additionalClasses = "",
    }: {
        onClick: () => void;
        disabled?: boolean;
        text: string;
        isLoading?: boolean;
        additionalClasses?: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`absolute z-10 w-60 px-6 py-2 mb-8 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-300 ${additionalClasses}`}
        >
            {isLoading ? "Processing..." : text}
        </button>
    );

    const GeneratorContainer = () => {
        return (
            <>
                <ActionButton
                    onClick={() => printFn()}
                    text="Print Meal Plan"
                    additionalClasses="top-20 right-14"
                />

                <ActionButton
                    onClick={handleEmailMealPlan}
                    disabled={emailLoading}
                    text="Email Meal Plan"
                    isLoading={emailLoading}
                    additionalClasses="top-32 right-14"
                />
                <MealPlanGenerator
                    confirmModalProps={confirmModalProps}
                    setConfirmModalProps={setConfirmModalProps}
                    clientData={clientData}
                    mealPlan={mealPlan}
                    setMealPlan={setMealPlan}
                    recipes={recipes}
                    setRecipes={setRecipes}
                    ref={componentRef}
                    emailLoading={emailLoading}
                    handleEmailMealPlan={handleEmailMealPlan}
                />
            </>
        );
    };

    return (
        <div>

            <GeneratorContainer />
        </div>
    );
};

export default MealPlanGeneratorContainer;