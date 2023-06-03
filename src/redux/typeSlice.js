import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTypeList } from "../api/type";

export const getTypeListAsync = createAsyncThunk(
  "type/getTypeListAsync",
  async () => {
    const resp = await getTypeList()
    // chunk.dispatch(initTypeList(resp.data))
    return resp.data
  }
)

const typeSlice = createSlice({
  name: "type",
  initialState: {
    typeList: [],  // 存储所有的类型
    issueTypeId: 'all',
    bookTypeId: 'all'
  },
  reducers: {
    updateIssueTypeId: (state, {payload}) => {
      state.issueTypeId = payload
    },
    updateBookTypeId: (state, {payload}) => {
      state.bookTypeId = payload
    }
    // initTypeList: (state, {payload}) => {
    //   state.typeList = payload
    // }
  },
  // 专门处理异步 reducer
  // extraReducers: {
  //   [getTypeListAsync.fulfilled]: (state, {payload}) => {
  //     state.typeList = payload
  //   }
  // }
  extraReducers: (builder) => {
    builder.addCase(getTypeListAsync.fulfilled, (state, {payload}) => {
      state.typeList = payload
    })
  }
})

// export const {initTypeList} = typeSlice.actions
export const {updateBookTypeId, updateIssueTypeId} = typeSlice.actions
export default typeSlice.reducer