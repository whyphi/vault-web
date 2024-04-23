"use client"

export default function Loader() {

  return (
    <div className="flex justify-center items-center min-h-screen">
      <style jsx>{`
        #loader {
          padding: 5px;
          border-radius: 5px;
          display: inline-flex;
        }
        #loader .ball {
          width: 10px;
          height: 10px;
          background: #9333ea;
          border-radius: 50%;
          animation: pulse 0.7s ease-in-out infinite;
        }
        #loader .ball:nth-child(2) {
          margin: 0 5px;
        }
        #loader .ball:nth-child(1) {
          animation-delay: 0.1s;
        }
        #loader .ball:nth-child(2) {
          animation-delay: 0.2s;
        }
        #loader .ball:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes pulse {
          50% {
            transform: scale(0.4);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      <div id="loader">
        <div className="ball" />
        <div className="ball" />
        <div className="ball" />
      </div>
    </div>
  )
}

