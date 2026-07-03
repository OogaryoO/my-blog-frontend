export interface StrapiImage {
  data: {
    attributes: {
      url: string;
      alternativeText?: string | null;
      width?: number;
      height?: number;
    };
  } | null;
}

export interface PostAttributes {
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  cover?: StrapiImage;
}

export interface Post {
  id: number;
  attributes: PostAttributes;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export type PostListResponse = StrapiResponse<Post[]>;
export type PostSingleResponse = StrapiResponse<Post>;
