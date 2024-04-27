
import { NavLink, Outlet } from "react-router-dom";
import "../css/FileLoad.css";

function FileLoad() {
  return (
    <div className="fileload">
      <div className="head">
        <NavLink to="/fileload/upload" className={
          ({ isActive }) => [
            "item",
            isActive ? "active" : ""
          ].join(" ")
        }>
          文件上传
        </NavLink>
        <NavLink to="/fileload/search" className={
          ({ isActive }) => [
            "item",
            isActive ? "active" : ""
          ].join(" ")
        }>
          文件搜索
        </NavLink>
        <NavLink to="/fileload/mylist" className={
          ({ isActive }) => [
            "item", 
            isActive ? "active" : ""
          ].join(" ")
        }>
          我的文件
        </NavLink>
        <NavLink to="/fileload/deletedFile" className={
          ({ isActive }) => [
            "item", 
            isActive ? "active" : ""
          ].join(" ")
        }>
          回收站
        </NavLink>
      </div>
      <div className="file-content">
        <Outlet />
      </div>
    </div>
  );
}

export default FileLoad