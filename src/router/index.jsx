import Issue from "../Pages/Issue";
import Books from "../Pages/Books";
import Interviews from "../Pages/Interviews";
import { Route, Routes, Navigate } from "react-router-dom";
import AddIssue from "../Pages/AddIssue";
import IssueDetail from "../Pages/IssueDetail";
import SearchPage from "../components/SearchPage";
import BookDetail from "../Pages/BookDetail";
import Personal from "../Pages/Personal";

export default function RouteConfig() {
  return (
    <Routes>
      <Route path="/issue" element={<Issue />}></Route>
      <Route path="/issue/:id" element={<IssueDetail />}></Route>
      <Route path="addIssue" element={<AddIssue />}></Route>
      <Route path="/books" element={<Books />}></Route>
      <Route path="/books/:id" element={<BookDetail />}></Route>
      <Route path="/interviews" element={<Interviews />}></Route>
      <Route path="/" element={<Navigate replace to="/issue" />}></Route>
      <Route path="/searchpage" element={<SearchPage />}></Route>
      <Route path="/personal" element={<Personal />}></Route>
    </Routes>
  )
}