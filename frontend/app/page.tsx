'use client';
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import WhatsappInput from "@/components/ui/WhatsAppInput";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";



const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Home() {
  const { token, logout } = useAuth();
  const router = useRouter();
  
  const sections = [
    { id: "home", component: <HomeSection /> },
    { id: "Guide", component: <Guide />},
    { id: "Contact", component: <Contact />},
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
              <span className="">JOBuzz </span>
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
                className="mt-6 font-semibold text-[#058d74] hover:underline"
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


function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus({
        type: 'success', 
        message: 'Message sent successfully!'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20">
      <div className="flex justify-center mb-12">
        <div className="rounded-full bg-[#1e1e1e] px-8 py-2 inline-block animate-fadeInUp">
          <span className="text-white text-lg font-medium">Let's Connect</span>
        </div>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fadeInUp">
        Get in Touch
      </h2>
      
      <div className="max-w-2xl mx-auto animate-fadeInUp">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden p-8 relative">
          {/* Terminal dots */}
          <div className="flex space-x-2 absolute top-4 left-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="mt-8 text-center mb-8">
            <p className="text-gray-400">
            Got questions or feedback? Whether you're here to explore, report issues, or just say hi, feel free to drop a message!
            </p>
          </div>
          
          {submitStatus.type && (
            <div className={`mb-6 p-4 rounded ${
              submitStatus.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <Input 
                id="name" 
                placeholder="Your Full Name" 
                className="bg-[#222] border-[#333] text-white"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Your Email" 
                className="bg-[#222] border-[#333] text-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Your Message</label>
              <Textarea
                id="message" 
                placeholder="Share your thoughts, feedback, or questions here!" 
                className="bg-[#222] border-[#333] text-white min-h-[120px]"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#01745f] hover:bg-[#016e5a] text-white font-medium py-5 rounded-md text-base flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'} <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};