This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Bugs

- Currently the meal plans can only use one meal plan active
- Creating a new meal plan must be done through the meal plan generator,
  a new meal plan through manual creation is not tested.
- Working with pagination where the week spans more than 1, the meals are
  incorrectly alloted to a cell. Workaround is to span 1 week at a time.
- Reload page after uploading picture to see on top of dashboard.

## Feature Guide

API Calls:

- When dealing with dates included in api calls, always convert to utc
  before storing, and convert to local when retrieving. This will allow
  users who live or travel to other state/countries to consistently show the date based, on their browser engine.

Meal Planner:

- Generate recipes based on user preferences
- Choose to use favorited recipes as part of the meal generation, favorited
  recipes must have a meal type and time scheduled assigned. The time scheduled
  for the favorited meal must align
- To generate a new meal plan that falls in the same date range, user must
  first delete meal plan, then create one. Otherwise create in a time range
  that does not fall inside any given meal plan for that user.
  - Inconsistently says fail to save eventhough it still saves

Meal Plan

- Replace recipes with desired recipe by editing it from the meal plan link, it
  will direct you to the recipes modal pre-filled, do not change the time
  scheduled or meal type. Once created, go back to the meal plan page and click
  on recreate meals. This will replace all meals that match that recipe.
-

Meal Preferences

- Inconsistently says fail to save eventhough it still saves
