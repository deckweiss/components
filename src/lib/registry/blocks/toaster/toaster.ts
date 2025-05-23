import { toast } from "svelte-sonner";
import CustomToastComponent from "./toast.svelte";

export type Toast = {
	type: "default" | "success" | "error";
	message: string;
	action?: { text: string; callback: () => void };
};

export const toaster = {
	pushToast: (t: Toast, options?: { duration?: number }) => {
		return toast.custom(CustomToastComponent, {
			componentProps: t,
			...options,
		});
	},
	dismissToast: (toastId: number | string) => {
		toast.dismiss(toastId);
	},
};
