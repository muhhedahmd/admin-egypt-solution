// middleware/error-middleware.ts
import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { showNotification } from "../slices/ui-slice";
import { NextMiddleware } from "next/server";
import { redirect } from "next/navigation";

export const errorMiddleware: Middleware<{}, RootState> =
  (store) => (next: any) => (action: any) => {
    // 1) محاولة تشغيل الـ action والتقاط الأخطاء المتزامنة (rare)
    try {
      const result = next(action);

      // 2) تحقق من حالات الـ rejected الخاصة بـ RTK (isRejectedWithValue يغطي حالات unwrap/rejected with value)
      if (isRejectedWithValue(action)) {
        // action.payload عادة يكون مفيد (من fetchBaseQuery)
        const payload: any = action.payload;
        const message =
          payload?.data?.message ||
          payload?.message ||
          payload?.statusText ||
          "Request failed";

        if (payload.status === 401) {
          redirect("/auth/login");
        }
        if (payload.status === 403) {
          redirect("/auth/login");
        }
        if (payload.status === 404) {
          store.dispatch(

            showNotification({
              type: "error",
              message,
            })
          );
        }
        if(payload.status === 400){
          store.dispatch(
            showNotification({
              type: "error",
              message,
            })
          );
        }

        // احتياطي: سجل
        // console.error("[RTK Query Rejected]", action, payload);
      } else if (action.type && action.type.endsWith("/rejected")) {
        // generic fallback for rejected actions that didn't use isRejectedWithValue
        const errMsg =
          (action as any).error?.message || "An operation was rejected";
        store.dispatch(
          showNotification({
            type: "error",
            message: errMsg,
          })
        );
        console.error("[Action Rejected]", action);
      }

      return result;
    } catch (error) {
      // 3) أخطاء تم رميها فعلاً أثناء الـ dispatch (synchronous)
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.log("[Redux Error]", errorMessage);
      console.error("[Redux Error]", error);

      store.dispatch(
        showNotification({
          type: "error",
          message: errorMessage,
        })
      );

      // أعد رمي الخطأ لو تريد أن يتعامل معه الـ caller
      throw error;
    }
  };
