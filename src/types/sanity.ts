export interface SanityProject {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  mediaType: 'image' | 'video';
  mediaUrl: string;
  layout: 'left' | 'right' | 'center' | 'stacked' | 'offset' | 'minimal' | 'hero' | 'asymmetric';
  link: string;
}
