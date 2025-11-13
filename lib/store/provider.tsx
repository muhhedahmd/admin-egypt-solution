
"use client"
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '../store/store';
import { useRef } from 'react';
import { Toaster } from '@/components/ui/toaster';
import ToastListener from '@/app/_comp/TosterListener';
import { Analytics } from '@vercel/analytics/next';
import { toast} from 'sonner';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      {children}
      <Analytics />
      


    </Provider>
  );
}
