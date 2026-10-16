import welcome from "../assets/welcome.png";
import pic2 from "../assets/pic2.png";

function RegisterSide() {
  return (
    <div className="flex flex-col justify-center items-center  bg-linear-to-b from-green-500 via-green-300 to-green-600 order-first lg:order-none px-6 pt-24 pb-10 sm:pb-14 lg:h-screen lg:px-8 lg:pt-20 lg:pb-4 select-none ">
      <img
        src={welcome}
        alt=""
        className="h-50 -mt-8 sm:h-32 xl:size-90  lg:max-h-[50vh]  w-auto max-w-full object-contain p-2 animate-spin-scale"
      />

     <p className="max-w-xl text-black text-base sm:text-lg xl:text-[20px] font-medium text-center -mt-10 sm:-mt-5 xl:-mt-20">
        <span className="text-3xl sm:text-4xl font-bold">FinTrack</span> is a
        smart expense tracking platform that helps you manage your daily
        spending, savings.
      </p>

      <img
        src={pic2}
        alt=""
        className="w-full max-w-xs sm:max-w-md xl:max-w-xl xl:pb-2 h-auto lg:max-h-[60vh] object-contain mt-3"
      />
    </div>
  );
}

export default RegisterSide;