import React from "react";
import PublicLayout from "./(public)/layout";
import HomePage from "./(public)/page";

export default function RootHomePage() {
  return (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
}
