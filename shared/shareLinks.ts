export type ArticleShareLinks = {
  facebook: string;
  line: string;
  article: string;
};

export function createArticleShareLinks(title: string, url: string): ArticleShareLinks {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    article: url,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
  };
}
