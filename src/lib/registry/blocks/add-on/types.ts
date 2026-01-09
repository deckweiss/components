export type AddOnUIMode = "drawer";

// NOTE: replace with actual add-on types e.g.
// export type AddOnType = 'application' | 'jobPosting' | 'employee' | 'jobRequest'
export type AddOnType = "example-add-on";

export interface AddOnGetParams {
	/**
	 * type of add on e.g. 'comment'
	 */
	t: AddOnType;
	/**
	 * id of 'comment'
	 */
	tid: string;
	/**
	 * UI Mode used to render 'comment'
	 * @default 'drawer'
	 */
	ui?: AddOnUIMode;
}

export interface AddOnEvents {
	addonedited: () => void;
}

export interface AddOnComponentProps {
	id: string;
	events: AddOnEvents;
}
