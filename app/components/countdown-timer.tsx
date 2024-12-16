import React, { useEffect, useState } from "react";

type CountdownTimerProps = {
  initialSeconds: number;
  isTimerActive: boolean;
  onComplete: () => void;
  onResend: () => void;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  isTimerActive,
  onComplete,
  onResend,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (isTimerActive && seconds === 0) {
      onComplete();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerActive, seconds, onComplete]);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return (
    <div className="mt-2 text-sm text-gray-500">
      {isTimerActive && seconds > 0 ? (
        <span>Resend code in {seconds}s</span>
      ) : (
        <button
          type="button"
          onClick={() => {
            onResend(); // Call the resend function
          }}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Resend Verification Code
        </button>
      )}
    </div>
  );
};

export default CountdownTimer;
