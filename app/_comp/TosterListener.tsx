

// components/ToastListener.tsx
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner"
import { RootState } from "@/lib/store/store";
import { clearNotification } from "@/lib/store/slices/ui-slice";

export default function ToastListener() {
    const dispatch = useDispatch();
    
    const notification = useSelector((state: RootState) => state.ui.notification);

    useEffect(() => {
        if (notification.type && notification.message) {
            // Map notification type to toast variant
            console.log({ notification })
            const { type, message } = notification;

            switch (type) {
                case "success":
                    toast.success(type, {
                        description: message,
                        
                    }
                    );

                    break;
                case "error":
                    console.log({ message })
                    toast.error(type , { 
                        description: message
                    });
                    break;
                case "info":
                    toast(message);
                    break;
                case "warning":
                    toast.warning ? toast.warning(message) : toast(message); // fallback
                    break;
            }

            // Clear it after showing so it doesn't re-trigger
            dispatch(clearNotification());
        }
    }, [notification, dispatch]);

    return null;
}
