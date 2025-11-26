"use client";

import {
  useState,
  useRef,
  useEffect,
  useTransition,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { CircleCheckIcon, CircleXIcon, LoaderIcon, LockIcon } from "./icons";
import { checkAccessCode } from "../actions";

/**
 * Automatically focuses the next or previous input field
 * depending on user typing or backspacing.
 */
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

interface AuthProps {
  onAuthorized: () => void;
}

/**
 * Simple 4-digit access code gate.
 * Used to protect admin routes or moderation panels.
 */
export default function Auth({ onAuthorized }: AuthProps) {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState(["", "", "", ""]);
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "pending"
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Autofocus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /**
   * Handles digit input and auto-focuses next input.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length > 1) e.target.value = value.at(-1)!;

    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
    setStatus("pending");

    if (e.target.value && index < 3) focusNext(inputRefs.current[index]);
  };

  /**
   * Handles key presses for backspace navigation and Enter submission.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      focusNext(inputRefs.current[index], true);
    }
    if (e.key === "Enter" && code.every((digit) => digit.length === 1)) {
      handleVerification();
    }
  };

  /**
   * Validates the entered code via a server action.
   */
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
          setCode(["", "", "", ""]);
          setStatus("error");
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
      } catch (error) {
        console.error("Server Action failed:", error);
        setCode(["", "", "", ""]);
        setStatus("error");
      }
    });
  };

  const isCodeComplete = code.every((digit) => digit.length === 1);
  const buttonDisabled = !isCodeComplete || status === "success" || isPending;

  // Dynamic status messaging
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
      <div className='mx-auto flex w-full max-w-4xl items-center justify-center p-8'>
        <div className='flex w-full max-w-sm flex-col items-center justify-center rounded-xl border-2 border-white bg-slate-100 px-6 py-8 text-center shadow-2xl sm:px-8'>
          {/* Icon and status indicator */}
          <div
            className={`rounded-full border p-3 sm:p-4 ${
              status === "error"
                ? "border-red-300 bg-red-300/80"
                : status === "success"
                  ? "border-green-300 bg-green-300/80"
                  : "border-blue-300 bg-blue-300/80"
            }`}
          >
            {status === "success" ? (
              <CircleCheckIcon className='size-6 text-green-600 sm:size-8' />
            ) : status === "error" ? (
              <CircleXIcon className='size-6 text-red-600 sm:size-8' />
            ) : (
              <LockIcon className='size-6 text-blue-600 sm:size-8' />
            )}
          </div>

          <h2 className='mt-4 text-xl font-extrabold text-gray-900 sm:text-[1.625rem] sm:leading-[1.35]'>
            Security Code
          </h2>
          <p className={`mt-2 text-sm font-medium ${statusColor}`}>
            {statusText}
          </p>

          {/* 4-digit input grid */}
          <div className='my-6 flex space-x-2.5 sm:space-x-3'>
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
                className={`h-12 w-10 rounded-lg border-2 text-center font-mono text-2xl text-black shadow-md transition-all duration-200 sm:h-14 sm:w-12 sm:text-3xl ${
                  status === "error"
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                } bg-gray-50 outline-none`}
              />
            ))}
          </div>

          {/* Submit button */}
          <button
            onClick={handleVerification}
            disabled={buttonDisabled}
            className={`mt-2 w-full max-w-2/3 transform rounded-lg py-2.5 text-sm font-semibold shadow-md transition duration-300 sm:max-w-7/8 sm:py-3 sm:text-base ${
              buttonDisabled
                ? "cursor-not-allowed bg-gray-500/70 text-white/60"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95"
            } ${isPending ? "flex items-center justify-center" : ""}`}
          >
            {isPending ? (
              <LoaderIcon className='size-4.5 animate-spin sm:size-5' />
            ) : status === "success" ? (
              "Accessing..."
            ) : (
              "Unlock Now"
            )}
          </button>

          <p className='pt-1 text-sm font-semibold text-gray-600 sm:mt-4'>
            Hint: 1 _ _ _
          </p>
        </div>
      </div>
    </>
  );
}
