export interface GalleryItem {
  mediaType: 'image' | 'video';
  url: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  mediaType: string;
  mediaUrl: string;
  gallery: GalleryItem[];
  layout: string;
  link: string;
}
