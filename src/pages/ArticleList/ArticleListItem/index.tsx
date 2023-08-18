import { useRequestImage } from "@/hook";
import { Image } from "antd";
import { Link } from "react-router-dom";
import defaultImage from '@/assets/images/default.png'
import MyTag from "@/component/MyTag";
import { CalendarOutlined, LockOutlined } from "@ant-design/icons";
import './index.scss';

interface Props extends BaseProps {
  article: Article;
  index: number;
}

function ArticleListItem({ article, index }: Props) {
  const imageSrc = useRequestImage(article);

  return (
    <div 
      className="article-list-item animate__animated animate__zoomIn"
      style={{
        animationDelay: `${index * 0.1}s`
      }}  
    >
      <div className="img-wrapper">
        <Link className="title" to={'/article/' + article.id}>
          <Image
            src={imageSrc}
            alt={article.title}
            title={article.title}
            fallback={defaultImage}
            loading="lazy"
            preview={false}
          />
        </Link>
        <Link className="tag-link" to={`/article?kw=${article.tag.name}`}>
          <MyTag color={article.tag.color}>{article.tag.name}</MyTag>
        </Link>
      </div>
      <div className="info">
        <span className="create-time">
          <CalendarOutlined />
          {article.createTime.format('YYYY年MM月DD日')}
        </span>
        {!article.publicState && (
          <span className="private-article">
            <LockOutlined />
            私有
          </span>
        )}
      </div>
      <span className="introduction">{article.introduction}</span>
    </div>
  );
}

export default ArticleListItem;