'use client';
import Image from "next/image";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import WhatsappInput from "@/components/ui/WhatsAppInput";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const { token, logout } = useAuth();
  const router = useRouter();
  
  const sections = [
    { id: "home", component: <HomeSection /> },
    { id: "Guide", component: <Guide />},
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animatedElements = entry.target.querySelectorAll('.animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight');
          animatedElements.forEach((el, index) => {
            setTimeout(() => {
              if (el.classList.contains('animate-fadeInUp')) {
                el.classList.add('animate-visible');
              } else if (el.classList.contains('animate-fadeInLeft')) {
                el.classList.add('animate-visible-left');
              } else if (el.classList.contains('animate-fadeInRight')) {
                el.classList.add('animate-visible-right');
              }
            }, index * 150);
          });
        }
      });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white relative">

      <div className="min-h-screen bg-[#121212] text-white">
        <div className="relative">
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-70"
              style={{ backgroundImage: "url('/uploads/heroBackgroudImg.png')" }}
          ></div>
          <div className="absolute inset-0 dot-pattern-overlay z-0"></div>

          <section id="home" className="min-h-screen py-16 relative z-10">
            <HomeSection />
          </section>
        </div>

        {sections.filter(section => section.id !== "home").map((section) => (
            <section key={section.id} id={section.id} className="min-h-screen py-16">
              {section.component}
            </section>
        ))}
      </div>

    </div>
  );
};


const HomeSection = () => {
  return (
    <>
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-32 flex flex-col items-center min-h-screen relative -mt-7 font-sans">
          <div className="absolute inset-0 dot-pattern-overlay z-0"></div>

          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#222]/60 border border-[#333] rounded-full py-1.5 px-5 inline-block mb-8"
            >
              <span className="flex items-center text-sm">
                <span className="bg-green-500 h-2 w-2 rounded-full mr-2 animate-blink"></span>
                <span className="text-gray-300">launching soon</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-6xl mb-6"
            >
              <span className="">JoBuzz </span>
              <span className="inline-block mx-2">✦</span>
              <span> Get Relevant Job Openings Instantly to Your WhatsApp.</span>
            </motion.h1>


            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-4xl md:text-5xl mt-6 text-[#00c9a4]"
            >
              Let Jobs Find You
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-lg text-gray-400 mt-8 max-w-3xl mx-auto"
            >
              <br />
              <div className="w-full sm:w-3/4 md:w-1/2 mx-auto pb-5">
                <WhatsappInput />
              </div>
              Chat with our WhatsApp bot and discover your careers.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-12"
            >
              <Button
                className="bg-[#1e1e1e] border border-[#333] text-white py-5 px-6 rounded-full text-base"
                onClick={() => {
                  const element = document.getElementById("Guide");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More ↓
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};


const features = [
  {
    id: 1,
    title: "Step 1",
    description:
      "Verify your mobile number to connect with us successfully.\nNote: This works only for Indian Phone numbers (+91).",
    imageUrl: "/OTP.png",
    cta: "Go to Sign In →",
    ctaUrl: "/signin",
  },
  {
    id: 2,
    title: "Step 2",
    description:
      "Complete your Onboarding to finish your registration process. This lets us know your Interests and preferences.",
    imageUrl: "/onboarding.png",
    cta: "Go to Onboarding →",
    ctaUrl: "/onboarding",
  },
  {
    id: 3,
    title: "Step 3",
    description:
      "We got you now, Leave it for our 'AI' to Automate your personalized Job haunt.",
    imageUrl: "/chat.png",
    cta: "Chat now →",
    ctaUrl: "",
  },
  {
    id: 4,
    title: "Step 4",
    description:
      "We got you now, Leave it for our 'AI' to Automate your personalized Job haunt.",
    imageUrl: "/mcp.png",
    cta: "Chat now →",
    ctaUrl: "",
  },
];

function Guide() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <h2 className="text-center text-4xl font-semibold mb-14">
        How it works
      </h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-5">
        {features.map(({ id, title, description, imageUrl, cta, ctaUrl }) => (
          <div key={id} className="flex flex-col border border-zinc-800">
            <div className="relative w-full h-48">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-10">
              <h3 className="text-xl font-sans mb-2">{title}</h3>
              <p className="text-zinc-500 font-sans">{description}</p>
              <a
                href={ctaUrl}
                className="mt-6 font-semibold text-blue-600 hover:underline"
                >
                {cta}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

