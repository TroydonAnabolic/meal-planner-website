// app/components/meal-planner/FoodLoader.tsx

import React from "react";
import Image from "next/image";
import styles from "./food-loader.module.css"; // Import the CSS module

export const FoodLoader: React.FC = () => (
  <div className={styles.loaderContainer}>
    <Image
      src="/aiimages/food/apple.svg"
      alt="Apple"
      width={50}
      height={50}
      className={`${styles.food} ${styles.apple}`}
    />
    <Image
      src="/aiimages/food/carrot.svg"
      alt="Carrot"
      width={50}
      height={50}
      className={`${styles.food} ${styles.carrot}`}
    />
    <Image
      src="/aiimages/food/banana.svg"
      alt="Banana"
      width={50}
      height={50}
      className={`${styles.food} ${styles.banana}`}
    />
    <Image
      src="/aiimages/food/pineapple.svg"
      alt="Pineapple"
      width={50}
      height={50}
      className={`${styles.food} ${styles.pineapple}`}
    />
    <Image
      src="/aiimages/food/watermelon.svg"
      alt="Watermelon"
      width={50}
      height={50}
      className={`${styles.food} ${styles.watermelon}`}
    />
    {/* Add more fruits and veggies as needed */}
  </div>
);
