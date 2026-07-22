import ms from "ms";

export const after = (value: ms.StringValue) => new Date(afterMs(value));
export const before = (value: ms.StringValue) => new Date(beforeMs(value));

export const afterMs = (value: ms.StringValue) => Date.now() + ms(value);
export const beforeMs = (value: ms.StringValue) => Date.now() - ms(value);
