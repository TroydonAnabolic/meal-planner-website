import Image from "next/image";

const timeline = [
  {
    name: "Launched meal planner beta",
    description:
      "Our first meal planning algorithm was introduced, helping users generate personalized meal plans based on dietary needs and preferences.",
    date: "Jan 2022",
    dateTime: "2022-01",
  },
  {
    name: "Expanded meal database",
    description:
      "We expanded our meal database to include thousands of new recipes, giving users even more variety and options.",
    date: "Apr 2022",
    dateTime: "2022-04",
  },
  {
    name: "Introduced AI-generated meal plans",
    description:
      "Our AI-based meal plan feature was released, helping users get smart meal suggestions tailored to their health goals.",
    date: "Sep 2022",
    dateTime: "2022-09",
  },
  {
    name: "Reached 1 million users",
    description:
      "A major milestone for our platform, with over 1 million users relying on our app to plan healthy meals every day.",
    date: "Dec 2023",
    dateTime: "2023-12",
  },
];

const jobOpenings = [
  // {
  //   id: 1,
  //   role: "Full-time UI/UX Designer",
  //   href: "#",
  //   description:
  //     "Help shape the future of healthy eating by designing intuitive and user-friendly interfaces for our meal planning platform.",
  //   salary: "$85,000 USD",
  //   location: "Remote",
  // },
  // {
  //   id: 2,
  //   role: "Senior React Developer",
  //   href: "#",
  //   description:
  //     "Work on building dynamic and responsive meal planning interfaces for users across all devices.",
  //   salary: "$130,000 USD",
  //   location: "Remote",
  // },
  // {
  //   id: 3,
  //   role: "Nutritional Data Scientist",
  //   href: "#",
  //   description:
  //     "Leverage data to develop algorithms that optimize meal plans for users based on their health metrics and preferences.",
  //   salary: "$115,000 USD",
  //   location: "Remote",
  // },
];

const AboutUsPage = () => {
  return (
    <main className="relative isolate max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
              Empowering people to eat healthy with smart meal planning.
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                Our meal planner generator offers personalized meal plans that
                fit your dietary preferences and health goals. Whether
                you&aposre looking to lose weight, manage a health condition, or
                just eat healthier, our app is here to help.
              </p>
            </div>
            <Image
              alt=""
              src="/aiimages/food/meal-plan.jpg"
              className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
              height={500}
              width={600}
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>

      {/* Timeline section */}
      <div className="mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.name}>
              <time
                dateTime={item.dateTime}
                className="flex items-center text-sm font-semibold leading-6 text-indigo-600"
              >
                <svg
                  viewBox="0 0 4 4"
                  aria-hidden="true"
                  className="mr-4 h-1 w-1 flex-none"
                >
                  <circle r={2} cx={2} cy={2} fill="currentColor" />
                </svg>
                {item.date}
                <div
                  aria-hidden="true"
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                />
              </time>
              <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                {item.name}
              </p>
              <p className="mt-1 text-base leading-7 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Logo cloud */}
      <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our users love us
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Thousands of satisfied users trust our meal planning platform to
            meet their health and dietary needs. Join them today!
          </p>
          <div className="mx-auto mt-20 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:max-w-4xl lg:grid-cols-5">
            {/* Add your logos or relevant images here */}
          </div>
        </div>
      </div>

      {/* Job openings section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-end justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
          <div className="w-full lg:max-w-lg lg:flex-auto">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Join our team and help us shape the future of meal planning
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              Be a part of our mission to help people live healthier lives
              through personalized meal plans. Check out our open positions and
              apply today.
            </p>
            <Image
              alt=""
              src="/jobs.jpg"
              className="mt-16 aspect-[6/5] w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-[34.5rem]"
              height={500}
              width={600}
            />
          </div>
          <div className="w-full lg:max-w-xl lg:flex-auto">
            <h3 className="sr-only">Job openings</h3>
            {jobOpenings.length > 0 ? (
              <ul className="-my-8 divide-y divide-gray-100">
                {jobOpenings.map((opening) => (
                  <li key={opening.id} className="py-8">
                    <dl className="relative flex flex-wrap gap-x-3">
                      <dt className="sr-only">Role</dt>
                      <dd className="w-full flex-none text-lg font-semibold tracking-tight text-gray-900">
                        <a href={opening.href}>
                          {opening.role}
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                        </a>
                      </dd>
                      <dt className="sr-only">Description</dt>
                      <dd className="mt-2 w-full flex-none text-base leading-7 text-gray-600">
                        {opening.description}
                      </dd>
                      <dt className="sr-only">Salary</dt>
                      <dd className="mt-4 text-base font-semibold leading-7 text-gray-900">
                        {opening.salary}
                      </dd>
                      <dt className="sr-only">Location</dt>
                      <dd className="mt-4 flex items-center gap-x-3 text-base leading-7 text-gray-500">
                        <svg
                          viewBox="0 0 2 2"
                          aria-hidden="true"
                          className="h-0.5 w-0.5 flex-none fill-gray-300"
                        >
                          <circle r={1} cx={1} cy={1} />
                        </svg>
                        {opening.location}
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg leading-8 text-gray-600">
                No openings available
              </p>
            )}
            <div className="mt-8 flex border-t border-gray-100 pt-8">
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                View all openings <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUsPage;
