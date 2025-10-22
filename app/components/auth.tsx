"use client";

import {
  useState,
  useRef,
  useEffect,
  useTransition,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { checkAccessCode } from "@/app/actions";

const focusNext = (
  currentInput: HTMLInputElement | null,
  isBackspace = false
) => {
  if (!currentInput) return;
  const nextSibling = isBackspace
    ? currentInput.previousElementSibling
    : currentInput.nextElementSibling;
  if (nextSibling && nextSibling.tagName === "INPUT") {
    (nextSibling as HTMLInputElement).focus();
  }
};

export default function Auth({ onAuthorized }: { onAuthorized: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState(["", "", "", ""]);
  const [status, setStatus] = useState("pending"); // 'pending', 'error', 'success'
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length > 1) {
      e.target.value = value[value.length - 1];
    }
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
    setStatus("pending");

    if (e.target.value && index < 3) {
      focusNext(inputRefs.current[index], false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      focusNext(inputRefs.current[index], true);
    }
    if (e.key === "Enter" && code.every((digit) => digit.length === 1)) {
      handleVerification();
    }
  };

  const handleVerification = () => {
    if (!code.every((digit) => digit.length === 1)) return;

    const enteredCode = code.join("");
    setStatus("pending");

    startTransition(async () => {
      try {
        const result = await checkAccessCode(enteredCode);

        if (result.success) {
          setStatus("success");
          setTimeout(onAuthorized, 1000);
        } else {
          setStatus("error");
          setCode(["", "", "", ""]);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
      } catch (error) {
        setStatus("error");
        console.error("Server Action failed:", error);
      }
    });
  };

  const isCodeComplete = code.every((digit) => digit.length === 1);
  const buttonDisabled = !isCodeComplete || status === "success" || isPending;

  let statusText = "Enter 4-digit access code";
  let statusColor = "text-gray-500";
  if (isPending) {
    statusText = "Checking code...";
    statusColor = "text-blue-500";
  } else if (status === "error") {
    statusText = "Invalid Code. Try again.";
    statusColor = "text-red-500";
  } else if (status === "success") {
    statusText = "Access Granted!";
    statusColor = "text-green-500";
  }

  return (
    <>
      <div className='mx-auto flex size-full items-center justify-center px-4 md:px-6 lg:px-8'>
        <div className='flex w-full max-w-sm flex-col items-center justify-center rounded-xl bg-white p-8 shadow-2xl'>
          <div
            className={`rounded-full p-3 ${status === "error" ? "bg-red-100" : status === "success" ? "bg-green-100" : "bg-blue-100"}`}
          >
            {status === "success" ? (
              <CheckCircle className='size-8 text-green-600' />
            ) : status === "error" ? (
              <XCircle className='size-8 text-red-600' />
            ) : (
              <Lock className='size-8 text-blue-600' />
            )}
          </div>

          <h2 className='mt-4 text-2xl font-extrabold text-gray-800'>
            Secure Access Gate
          </h2>
          <p className={`mt-2 text-sm font-medium ${statusColor}`}>
            {statusText}
          </p>

          <div className='my-6 flex space-x-3'>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type='text'
                maxLength={1}
                inputMode='numeric'
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isPending}
                className={`h-14 w-12 rounded-lg border-2 text-center font-mono text-3xl shadow-md transition-all duration-200 ${status === "error" ? "border-red-400 focus:border-red-600" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} bg-gray-50 outline-none`}
              />
            ))}
          </div>

          <button
            onClick={handleVerification}
            disabled={buttonDisabled}
            className={`mt-2 w-full transform rounded-lg py-3 font-semibold text-white shadow-md transition duration-300 ${
              buttonDisabled
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            } ${isPending ? "flex items-center justify-center" : ""}`}
          >
            {isPending ? (
              <svg
                className='size-5 animate-spin text-white'
                width={20}
                height={20}
                strokeWidth='2'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M21 12a9 9 0 1 1-6.219-8.56' />
              </svg>
            ) : status === "success" ? (
              "Accessing..."
            ) : (
              "Unlock Content"
            )}
          </button>

          <p className='mt-4 text-xs text-gray-400'>Hint: Gavin Phoenix</p>
        </div>
      </div>
    </>
  );
}
