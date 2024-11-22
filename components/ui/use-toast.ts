"use client";

import { Toast } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToastAction = React.ReactNode;

interface BaseToast {
  title?: string;
  description?: string;
  action?: ToastAction;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ToasterToast extends BaseToast {
  id: string;
}

type ToastActionType =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

interface ToastState {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function genId() {
  return Math.random().toString(36).substring(2, 10);
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

const reducer = (state: ToastState, action: ToastActionType): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id
            ? { ...toast, ...action.toast }
            : toast
        ),
      };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toastId || action.toastId === undefined
            ? { ...toast, open: false }
            : toast
        ),
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastActionType) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function toast(props: BaseToast) {
  const id = genId();

  dispatch({
    type: "ADD_TOAST",
    toast: {
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss(id);
      },
      ...props,
    },
  });

  return {
    id,
    update: (props: Partial<BaseToast>) =>
      dispatch({ type: "UPDATE_TOAST", toast: { id, ...props } }),
    dismiss: () => dismiss(id),
  };
}

function dismiss(toastId?: string) {
  dispatch({ type: "DISMISS_TOAST", toastId });
}

function useToast() {
  const toasts = memoryState.toasts; // Ensure this is accessible
  return { toasts, toast, dismiss };
}

export { toast, useToast };