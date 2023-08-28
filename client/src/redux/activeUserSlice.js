import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  email: '',
  profile_image: '',
  bio: '',
  contact_person: '',
};

const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState,
  reducers: {
    setActiveUser: (state, { payload }) => {
      state.id = payload.id;
      state.email = payload.email;
      state.profile_image = payload.profile_image;
      state.bio = payload.bio;
      state.contact_person = payload.contact_person;
    },
    setUserNameAndBio: (state, { payload }) => {
      state.contact_person = payload.contact_person;
      state.bio = payload.bio;
    },
  },
});
export const { setActiveUser, setUserNameAndBio } = activeUserSlice.actions;
export default activeUserSlice.reducer;
