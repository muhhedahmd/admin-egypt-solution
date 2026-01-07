import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300
) => {
  console.log("trigger1")
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    console.log("trigger2")
    timeout = setTimeout(() => fn.apply(this, args), delay);
    console.log("trigger3")
  };
};

export const ClipboardCopyButton = ()=>{
  
}