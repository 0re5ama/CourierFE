import create from "zustand";

// if (process.env.NODE_ENV === "development") {
//     mountStoreDevtool("TestStore", useTestStore);
// }
const useTestStore = create((set) => ({
    counter: 10,
    increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
    resetCounter: () => set({ counter: 0 }),
    changedTableData:()=>set({data:changedData})

}));


export default useTestStore;