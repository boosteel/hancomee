
type INPUTS = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type INPUT_VALID = (ele: INPUTS, val: string) => boolean;
type GROUP_VALID = (ele: HTMLElement, val: string) => boolean
type INPUT_MAP = { [index: string]: INPUT_VALID };
type GROUP_MAP = { [index: string]: GROUP_VALID };
type ERROR_MAP = { [index: string]: string }

