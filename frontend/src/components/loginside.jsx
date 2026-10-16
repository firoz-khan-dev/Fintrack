import { useMemo } from "react";
import welcomeBack from "../assets/welcomeBack.png";
import budget from "../assets/budget.png";

function LoginSide() {
  // random values are created once, so the notes don't jump on every re-render
  const notes = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        size: 18 + Math.random() * 18,
      })),
    [],
  );

  return (
    <div className="order-first lg:order-none overflow-hidden lg:h-screen">
      <div className="relative flex flex-col justify-center items-center gap-5 bg-linear-to-b from-green-500 via-green-300 to-green-600 px-6 pt-24 pb-10 sm:pb-14 lg:h-screen lg:px-8 lg:pt-20 lg:pb-4 select-none">
        {/* Money Rain */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {notes.map((n, i) => (
            <span
              key={i}
              className="absolute animate-money-fall"
              style={{
                left: `${n.left}%`,
                fontSize: `${n.size}px`,
                animationDuration: `${n.duration}s`,
                animationDelay: `${n.delay}s`,
              }}
            >
              💵
            </span>
          ))}
        </div>

        <img
          src={welcomeBack}
          alt=""
          className="relative -mt-15 h-52 sm:h-72 md:h-80 lg:h-[20rem] xl:h-[20rem] w-auto max-w-full object-contain p-2 animate-spin-scale"
          style={{ perspective: "1000px" }}
        />
        <p className="relative max-w-xl text-black text-lg sm:text-xl xl:text-2xl font-semibold text-center -mt-20">
          <span className="text-3xl sm:text-4xl font-bold">User,</span> Enter
          Your Details and Login!
        </p>

        <img
          src={budget}
          alt=""
          className="relative w-full max-w-xs sm:max-w-md xl:max-w-xl h-auto lg:max-h-[50vh] object-contain"
        />
      </div>
    </div>
  );
}

export default LoginSide;
