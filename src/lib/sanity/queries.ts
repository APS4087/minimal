export const projectsQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  description,
  techStack,
  layout,
  link,
  order,
  "mediaType": mediaType,
  "mediaUrl": select(
    mediaType == "video" => coverVideo.asset->url,
    coverImage.asset->url
  ),
  "gallery": gallery[] {
    "mediaType": select(_type == "galleryVideo" => "video", "image"),
    "url": asset->url
  }
}`;

export const aboutQuery = `*[_type == "about"][0] {
  bio,
  currentRoles,
  stats[] { value, label },
  stackGroups[] { area, skills, accent },
  pullQuote,
  communityQuote,
  closingTagline,
  events[] {
    year,
    title,
    role,
    description,
    stats[] { value, label },
    "heroImageUrl": heroImage.asset->url,
    "galleryImageUrls": galleryImages[].asset->url,
    "featuredVideoUrl": featuredVideo.asset->url
  },
  achievements[] {
    year,
    title,
    result,
    description,
    "heroImageUrl": heroImage.asset->url,
    "featuredVideoUrl": featuredVideo.asset->url
  }
}`;
