import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTimer } from "react-icons/io";
import { FaRegBuilding, FaFacebook, FaTwitter, FaLinkedin, FaInstagram,} from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import api from "../services/api";
import { useRef } from "react";

const infoCards = [
  {
    Icon: MdOutlineMarkEmailUnread,
    green: "Email",
    rest: "Us",
    l1: "support@fintrack.com",
    l2: "fintrack@trackers.com",
  },
  {
    Icon: IoCall,
    green: "Call",
    rest: "Us",
    l1: "+91 6307xxxxxx",
    l2: "+91 6307xxxxxx",
  },
  {
    Icon: FaLocationDot,
    green: "Visit",
    rest: "Us",
    l1: "FinTrack HQ",
    l2: "Lucknow, India",
  },
  {
    Icon: IoIosTimer,
    green: "Working",
    rest: "Hours",
    l1: "Monday - Friday",
    l2: "10:00 AM - 6:00 PM",
  },
];

const socials = [
  {
    Icon: FaFacebook,
    link: "https://www.facebook.com",
  },
  {
    Icon: FaTwitter,
    link: "https://twitter.com/",
  },
  {
    Icon: FaLinkedin,
    link: "https://www.linkedin.com/",
  },
  {
    Icon: FaInstagram,
    link: "https://www.instagram.com/",
  },
];

const faqs = [
  {
    green: "assessment work?",
    before: "How does the ",
    after: "",
    answer:
      "FinTrack is a simple and user-friendly expense tracking application designed to help you manage your money more effectively.",
  },
  {
    green: "service free?",
    before: "Is the ",
    after: "",
    answer:
      "Yes, FinTrack is completely free to use. You can track your income and expenses, manage transactions, organize your spending by category, and monitor your financial activity without any subscription or hidden charges.",
  },
  {
    green: "my expenses?",
    before: "How can I manage ",
    after: "",
    answer:
      "Managing your expenses with FinTrack is simple. Add your daily expenses, select a category, and enter the amount and date. You can then view, edit, or delete transactions and use filters to understand your spending. Tracking your expenses regularly helps you stay organized and manage your budget effectively.",
  },
];

const inputClass =
  "w-full min-w-0 outline-none text-white mb-1 placeholder:text-[15px] placeholder:text-gray-500 bg-transparent";

function Field({ label, children }) {
  return (
    <fieldset className="border border-green-500 rounded-lg px-4 pt-1 pb-2 box-border">
      <legend className="px-1.5 text-[16px] font-medium text-white">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function Contact() {
  const formRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!name || !email || !subject || !message) {
      setErrorMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contact/send", { name, email, subject, message });
      setSuccessMessage("Message sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.log("Contact error:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-15 bg-black pb-10 overflow-x-hidden select-none">
      {/* HERO */}
      <div className="bg-[linear-gradient(135deg,_#000000,_#2c2c2c)] relative overflow-hidden select-none px-4 pt-10 pb-24 sm:px-6 md:pt-14 md:pb-28">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
          <button
            onClick={() => {
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="text-green-500 bg-black/ dark:bg-black/20 font-semibold pl-11 pr-8 py-2 rounded-4xl border-y-2 border-green-500 relative cursor-pointer animate-[bounce_2s_infinite] "
          >
            Get in Touch
            <FiMessageCircle className="absolute top-3.5 left-4" />
          </button>

          <p className="text-white mt-5 text-4xl sm:text-5xl lg:text-6xl font-medium">
            Contact <span className="text-green-500">Us</span>
          </p>

          <p className="text-white/90 mt-6 md:mt-8 tracking-wide leading-7 text-base sm:text-[18px]">
            <span className="font-semibold text-xl sm:text-2xl text-green-500">
              Have a question,
            </span>{" "}
            suggestion, or facing an issue with your account? We're here to
            help. Whether you need support with tracking your expenses, want to
            report a bug, or just want to share feedback on how we can make
            FinTrack better — reach out to us anytime. Our team typically
            responds within 24 hours. Your financial data and privacy matter to
            us, so rest assured every conversation stays confidential.
          </p>
        </div>

        {/* Bottom Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-12 sm:h-auto"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="bottomGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform="rotate(160)"
            >
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#1F1F23" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bottomGradient)"
            d="M0,60 C180,110 360,110 540,60 C720,10 900,10 1080,60 C1260,110 1350,100 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* INFO CARDS */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4 sm:px-6 lg:px-10 pt-5">
        {infoCards.map(({ Icon, green, rest, l1, l2 }) => (
          <div
            key={green}
            className="min-h-50 border-y-2 dark:border-y border-green-500 rounded-2xl shadow-2xl shadow-white/10 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2 p-5"
          >
            <Icon className="text-white/90 size-12" />
            <p className="text-white text-xl font-semibold mt-3">
              <span className="text-green-600">{green}</span> {rest}
            </p>
            <p className="text-gray-300 text-[17.5px] mt-3 break-words">{l1}</p>
            <p className="text-gray-500 break-words">{l2}</p>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div ref={formRef} className="mx-auto max-w-7xl mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-10">
        {/* Contact Form */}
        <div className="border-green-500 border-y-2 rounded-2xl shadow-2xl shadow-white/10 p-5 sm:p-6 h-fit">
          <p className="text-white text-2xl font-semibold">
            <span className="text-green-500">Send Us</span> a Message
          </p>
          <p className="text-gray-400 mt-1.5">
            Fill out the form and we'll get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <Field label="Full Name *">
              <input
                type="text"
                placeholder="Salman Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Email Address *">
              <input
                type="email"
                placeholder="salmankhan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Subject *">
              <input
                type="text"
                placeholder="How Can We help?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Message *">
              <textarea
                placeholder="Tell us what you're thinking..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} h-[120px] resize-none align-top`}
              />
            </Field>

            {successMessage && (
              <p className="text-green-500 text-center font-medium">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-center font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full border-y border-red-500 rounded-xl py-3 text-white font-semibold transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-red-500 hover:text-white active:bg-red-500"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Social Section */}
          <div className="mt-10 flex flex-col items-center">
            <div className="flex w-full items-center gap-3">
              <span className="connect-divider h-0.5 flex-1 bg-white/10"></span>
              <TfiWorld className="text-white size-5 shrink-0" />
              <p className="text-white text-xl sm:text-2xl font-semibold text-center">
                Connect<span className="text-green-500"> With Us</span>
              </p>
              <span className=" connect-divider h-0.5 flex-1 bg-black dark:bg-white/10"></span>
            </div>

            <div className="flex flex-wrap justify-center gap-5 mt-6">
              {socials.map(({ Icon, link }) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-13 cursor-pointer  rounded-full border dark:border-white/20 flex items-center justify-center hover:bg-green-500 active:bg-green-500 shadow-2xl shadow-black/50"
                >
                  <Icon className="text-white size-8" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-8">
          {/* Map */}
          <div className="border-white/90 border-y-2 rounded-2xl shadow-2xl shadow-white/10 relative overflow-hidden h-72 sm:h-80">
            <iframe
              src="https://www.google.com/maps?q=Lucknow,Uttar+Pradesh,India&output=embed"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="FinTrack Headquarters"
            ></iframe>

            <p className="py-2 px-4 bg-gray-300 dark:bg-gray-800 absolute bottom-0 left-0 w-full flex items-center gap-3">
              <FaRegBuilding className="size-6 shrink-0 text-gray-300" />
              <span className="text-gray-300 text-[17px] font-semibold">
                <span className="text-green-500">FinTrack</span> Headquarters
              </span>
            </p>
          </div>

          {/* FAQ */}
          <div className="border-green-500 border-y-3 dark:border-y-2 rounded-2xl shadow-2xl shadow-white/10 p-5 sm:p-6">
            <p className="text-xl sm:text-[21px] text-white font-semibold">
              <span className="text-green-500">Frequently</span> Asked Questions
            </p>

            {faqs.map((f, i) => (
              <div key={f.green}>
                <p className="text-white text-[16px] mt-5 font-medium hover:text-green-400 cursor-pointer">
                  {f.before}
                  <span className="text-green-500">{f.green}</span>
                </p>
                <p className="text-white mt-3 text-[14px] font-light">
                  {f.answer}
                </p>
                {i < faqs.length - 1 && (
                  <div className=" connect-divider h-0.5 w-full mt-5 bg-white/10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
