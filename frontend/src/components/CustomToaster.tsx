import toast, { Toaster } from "react-hot-toast";
import { useToaster } from "react-hot-toast/headless";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          width: "400px",
          border: "2px solid #646669",
          backgroundColor: "#2C2E31",
          padding: "24px 32px",
          color: "#D1D0C5",
          fontFamily: "Roboto Mono",
          fontSize: "1rem",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#305029",
            secondary: "#2C2E31",
          },
          style: {
            width: "400px",
            border: "2px solid #E2B714",
            backgroundColor: "#2C2E31",
            padding: "24px 32px",
            color: "#D1D0C5",
            fontFamily: "Roboto Mono",
            fontSize: "1rem",
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: "#CA4754",
            secondary: "#305029",
          },
          style: {
            width: "400px",
            border: "2px solid #CA4754",
            backgroundColor: "#2C2E31",
            padding: "24px 32px",
            color: "#D1D0C5",
            fontFamily: "Roboto Mono",
            fontSize: "1rem",
          },
        },
      }}
    />
  );
};

export default CustomToaster;

// const CustomToaster = () => {
//   const { toasts, handlers } = useToaster();
//   const { startPause, endPause, calculateOffset, updateHeight } = handlers;
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 8,
//         left: 8,
//       }}
//       onMouseEnter={startPause}
//       onMouseLeave={endPause}
//     >
//       {toasts.map((toast) => {
//         const offset = calculateOffset(toast, {
//           reverseOrder: false,
//           gutter: 8,
//         });

//         const ref = (el) => {
//           if (el && typeof toast.height !== "number") {
//             const height = el.getBoundingClientRect().height;
//             updateHeight(toast.id, height);
//           }
//         };
//         return (
//           <div
//             key={toast.id}
//             ref={ref}
//             style={{
//               position: "absolute",
//               width: "200px",
//               background: "papayawhip",
//               transition: "all 0.5s ease-out",
//               opacity: toast.visible ? 1 : 0,
//               transform: `translateY(${offset}px)`,
//             }}
//             {...toast.ariaProps}
//           >
//             {toast.message}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CustomToaster;
