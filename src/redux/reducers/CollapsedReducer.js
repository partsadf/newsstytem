export const CollapsedReducer = (prevState = { isCollapsed: false },action) => {
	const { type } = action;
	switch (type) {
		case "change-collapsed":
			const newstate = { ...prevState };
			newstate.isCollapsed = !newstate.isCollapsed;
			return newstate;

		default:
			return prevState;
	}
};
