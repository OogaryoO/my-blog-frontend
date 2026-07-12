import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  name?: string;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: BlocksContent;
  publishedAt: string;
  cover?: StrapiMedia | null;
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
