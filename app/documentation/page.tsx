import React from "react";

const DocumentationPage = () => {
    return (
        <main className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6">
                Meal Planner Website Documentation
            </h1>
            <section className="mb-8">
                <p className="text-lg">
                    Welcome to our Meal Planner website! Our goal is to help you
                    effortlessly plan meals that align with your preferences. This guide
                    will walk you through how to use the website and make the most out of
                    its features.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Core Functionality</h2>
                <p className="mb-4">
                    Our meal planner can automatically generate meal plans tailored to
                    your needs. Whether you want to eat healthier, save time, or follow a
                    specific diet, our tool makes it easy for you!
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>
                        <strong>Meal Plan Generation</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                The website creates personalized meal plans based on your
                                stored preferences.
                            </li>
                            <li>
                                You can generate meals using your own recipes or recipes from
                                our Edamam database.
                            </li>
                            <li>
                                You have full control over your meal plans, with options to edit,
                                delete, and add new ones.
                            </li>
                            <li>
                                You can print your meal plan using your browser’s print function
                                or a dedicated Print Meal Plan button.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Managing Your Meal Plans</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>A meal plan consists of multiple recipes.</li>
                            <li>A recipe consists of multiple meals.</li>
                            <li>Both meals and recipes contain ingredients.</li>
                            <li>
                                You can create, update, and delete meal plans, recipes, meals, and
                                ingredients.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Setting Meal Preferences</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                To get the best meal plan, you need to store your meal preferences
                                in the Preferences section.
                            </li>
                            <li>
                                You can specify preferences for all meals or customize them for
                                each individual meal.
                            </li>
                            <li>You can also set the number of meals you want per day.</li>
                            <li>
                                The generator will then create a meal plan that matches your
                                choices.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Subscription &amp; User Registration</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                Our meal plan generator is only available to subscribed users.
                            </li>
                            <li>Subscription starts at $5 per week.</li>
                            <li>Users must register an account to use the service.</li>
                            <li>
                                You can update your profile information anytime in the Settings
                                section.
                            </li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">How to Get Started</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Sign up for an account.</li>
                    <li>Subscribe to unlock meal planning features.</li>
                    <li>Set your meal preferences in the Preferences section.</li>
                    <li>Click Generate Meal Plan to get your personalized plan.</li>
                    <li>Edit or print your plan as needed.</li>
                </ul>
            </section>

            <section>
                <p className="text-lg">
                    That’s it! You’re all set to enjoy customized, easy meal planning with
                    our website. Happy meal planning!
                </p>
            </section>
        </main>
    );
};

export default DocumentationPage;