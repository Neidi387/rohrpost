import { defineStore } from "pinia";

export const useStateStore = defineStore<'state', IStateStore>({
    id: 'state',
    state: () => {
        const state: IStateStore = {
            isLoading: false,
        }
        return state;
    }
})

export interface IStateStore {
    isLoading: boolean;
}