// frontend/app/page.tsx
"use client";
import dynamic from "next/dynamic";

// Load the component only on the client
const Home = dynamic(() => import("./HomeContent"), { ssr: false });
export default Home;
