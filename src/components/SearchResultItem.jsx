import React from 'react';
import IssueItems from './IssueItems';
import BookItem from '../components/BookItem'

/**
 * 根据搜索类型返回不同类型的组件（IssueItem || BookItem）
 * @param {*} props 
 * @returns 
 */
function SearchResultItem(props) {
  return (
    <div>
      {
        props.info.issueTitle ? 
        <IssueItems issueInfo={props.info} />
        :
        <BookItem bookInfo={props.info} />
      }
    </div>
  );
}

export default SearchResultItem;