import { toast } from "svelte-sonner";
import CustomToastComponent from "./toast.svelte";

export type Toast = {
	type: "default" | "success" | "error" | "loading";
	message: string;
	action?: { text: string; callback: () => void };
};

export const toaster = {
	pushToast: (t: Toast, options?: { duration?: number }) => {
		const toastId: number | string = toast.custom(CustomToastComponent, {
			componentProps: {
				...t,
				dismiss: () => toast.dismiss(toastId),
			},
			...options,
		});
		return toastId;
	},
	dismissToast: (toastId: number | string) => {
		toast.dismiss(toastId);
	},
};
