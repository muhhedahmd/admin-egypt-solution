// middleware/error-middleware.ts
import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { showNotification } from "../slices/ui-slice";
import { NextMiddleware } from "next/server";
import { redirect } from "next/navigation";

export const errorMiddleware: Middleware<{}, RootState> =
  (store) => (next: any) => (action: any) => {
    try {
      const result = next(action);

      if (isRejectedWithValue(action)) {
        const payload: any = action.payload;
        const message =
          payload?.data?.message ||
          payload?.message ||
          payload?.statusText ||
          "Request failed";

        if (payload.status === 401) {
          if (process.env.NEXT_PUBLIC_FALLBACK_TOKEN) {
            console.warn("Bypassing 401 Redirect for Demo Token");
            return result;
          }
          redirect("/auth/login");
        }
        if (payload.status === 403) {
          if (process.env.NEXT_PUBLIC_FALLBACK_TOKEN) {
            console.warn("Bypassing 403 Redirect for Demo Token");
            return result;
          }
          redirect("/auth/login");
        }
        if (payload.status === 404) {
          store.dispatch(
            showNotification({
              type: "error",
              message,
            }),
          );
        }
        if (payload.status === 400) {
          store.dispatch(
            showNotification({
              type: "error",
              message,
            }),
          );
        }
      } else if (action.type && action.type.endsWith("/rejected")) {
        const errMsg =
          (action as any).error?.message || "An operation was rejected";
        store.dispatch(
          showNotification({
            type: "error",
            message: errMsg,
          }),
        );
        console.error("[Action Rejected]", action);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.log("[Redux Error]", errorMessage);
      console.error("[Redux Error]", error);

      store.dispatch(
        showNotification({
          type: "error",
          message: errorMessage,
        }),
      );

      throw error;
    }
  };
