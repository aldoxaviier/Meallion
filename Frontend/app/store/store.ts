import {configureStore, createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: {email : null, token: null},
    reducers : {
        login: (state, action) => {
            state.email = action.payload.email;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.email = null;
            state.token = null;
        }
    }
})

const store = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})

export default store;
export const { login,logout } = userSlice.actions;
export type RootState = ReturnType<typeof store.getState>;