"use client";

import React from "react";
import { SignInPage, Testimonial } from "./sign-in";

interface Props {
  heroImageSrc?: string;
  testimonials?: Testimonial[];
}

export default function SignInClient({
  heroImageSrc,
  testimonials = [],
}: Props) {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("WALL-E sign in submitted:", data);
    // Redirect to port 3000
    window.location.href =
      "https://wall-e-notion-clone.vercel.app/?_vercel_share=KSlyMDZhitn9QwaKdbRJ2CPnfqc4t26G";
  };

  const handleGoogleSignIn = () => {
    console.log("WALL-E Google sign in clicked");
    // Redirect to port 3000
    window.location.href =
      "https://wall-e-notion-clone.vercel.app/?_vercel_share=KSlyMDZhitn9QwaKdbRJ2CPnfqc4t26G";
  };

  const handleResetPassword = () => {
    alert("WALL-E password reset flow coming soon.");
  };

  const handleCreateAccount = () => {
    alert("WALL-E account creation flow coming soon.");
  };

  return (
    <SignInPage
      heroImageSrc={heroImageSrc}
      testimonials={testimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
}
