import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInterviewTitle } from "../api/interviews";

export const getInterviewTitleAsync = createAsyncThunk(
  "interview/getInterviewTitleAsync",
  async (_, thunkApi) => {
    const {data} = await getInterviewTitle()
    thunkApi.dispatch(initInterviewTitleList(data))
  }
)

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    interviewTitleList: []
  },
  reducers: {
    initInterviewTitleList: (state, {payload}) => {
      state.interviewTitleList = payload
    }
  }
})

export default interviewSlice.reducer
const {initInterviewTitleList} = interviewSlice.actions