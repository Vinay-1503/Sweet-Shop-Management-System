import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          {/* Company Name */}
          <h1 className="text-4xl font-bold text-[#FF6DAA] mb-2 tracking-tight">
            KATA
          </h1>
          <p className="text-xl text-[#FF6DAA]/90 font-light tracking-widest">
            SWEETS
          </p>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center items-center my-6 w-full"
        >
          <div className="loader"></div>
          <style>{`
            .loader {
              height: 15px;
              aspect-ratio: 4;
              --_g: no-repeat radial-gradient(farthest-side, #FF6DAA 90%, #FF9FC6);
              background:
                var(--_g) left,
                var(--_g) right;
              background-size: 25% 100%;
              display: grid;
            }
            .loader:before,
            .loader:after {
              content: "";
              height: inherit;
              aspect-ratio: 1;
              grid-area: 1/1;
              margin: auto;
              border-radius: 50%;
              transform-origin: -100% 50%;
              background: #FF6DAA;
              animation: l49 1s infinite linear;
            }
            .loader:after {
              transform-origin: 200% 50%;
              --s: -1;
              animation-delay: -0.5s;
            }
            @keyframes l49 {
              58%,
              100% {
                transform: rotate(calc(var(--s, 1) * 1turn));
              }
            }
          `}</style>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-[#FF6DAA]/80 mt-8 text-lg font-light"
        >
          Premium Sweets & Desserts
        </motion.p>
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF6DAA]/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FF6DAA]/10 rounded-full blur-2xl" />
    </div>
  );
};

export default SplashScreen;