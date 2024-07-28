import React from 'react';

function PageFooter(props) {
  return (
    <div>
    <p className="links">
        <span className="linkItem">友情链接：</span>
        <a
            href="https://www.yuque.com/yuqueyonghuyvwkzn/dgzfcm/fh7eqtsuec2ra16u"
            target="_blank"
            rel="noreferrer"
            className="linkItem"
        >
            我的语雀
        </a>
        <a
            href="http://121.40.178.172:3001/assets"
            target="_blank"
            rel="noreferrer"
            className="linkItem"
        >
            我的博客
        </a>
        <a
            href="https://github.com/saka-wl"
            target="_blank"
            rel="noreferrer"
            className="linkItem"
        >
            Github
        </a>
    </p>
    <p>© 2024 - Coder Station</p>
    <p>Powered by Create React App</p>
</div>
  );
}

export default PageFooter;