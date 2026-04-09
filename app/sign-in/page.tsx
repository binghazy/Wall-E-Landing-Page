import React from "react";
import SignInClient from "@/components/ui/sign-in-client";
import { Testimonial } from "@/components/ui/sign-in";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://scontent-hbe1-2.xx.fbcdn.net/v/t39.30808-1/504630368_3665096226967339_4972814584204981514_n.jpg?stp=c142.848.1200.1200a_dst-jpg_s100x100_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=m-lUZEuRMgwQ7kNvwFGBCNB&_nc_oc=AdoqnYAdYtIzmhCwpyfVFHM_AgDK4aiU9953oIUeAJFbJiK931brym_akO6tKEK3kjY&_nc_zt=24&_nc_ht=scontent-hbe1-2.xx&_nc_gid=9Mr_pJs2bb3NbHs1UW6m_A&_nc_ss=7a3a8&oh=00_Af3ziWQZZGjSQ4tP9_HPEHD1k-AHWKM3fwyGOyGzQ4fgmQ&oe=69DC8AD3",
    name: "Eng.Merit Samir",
    handle: "@meritsamir",
    text: "Finally replaced Notion with something better! The AI features are game-changing. Real-time collaboration just works perfectly.",
  },
  {
    avatarSrc: "https://i.ibb.co/VhTYRTq/Screenshot-2026-04-08-222931.png",
    name: "Dr.Aya Elzoughbi",
    handle: "@ayaelzoughbi",
    text: "The editor is buttery smooth and the publishing feature is incredible. My team syncs instantly without any lag.",
  },
  {
    avatarSrc: "https://scontent-hbe1-2.xx.fbcdn.net/v/t39.30808-1/468850101_10162076242443749_1683247607688348639_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=4VsaXJLbuK0Q7kNvwF4y9-S&_nc_oc=AdrALYZRlMAwC-1recv3f8yvzzN5y5jJHDykkotGUILFhKQzC1sDByMSG31hd-FXQAE&_nc_zt=24&_nc_ht=scontent-hbe1-2.xx&_nc_gid=h0MX17XDhQd1evWqNHXwFQ&_nc_ss=7a3a8&oh=00_Af24HSv6ZtumUglFueg2rc03HuvVX0QrSHmIJpGdjog_aA&oe=69DC7AA9",
    name: "Prof.Khaled Fouad",
    handle: "@khaledfouad",
    text: "Guest mode is brilliant for sharing with clients. The AI assistant helps me write and organize documents faster than ever.",
  },
];

export default function SignInRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black via-50% to-pink-500">
      <SignInClient
        heroImageSrc="/images/signin-whale.png"
        testimonials={sampleTestimonials}
      />
    </div>
  );
}
