export const projectsQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  description,
  techStack,
  media,
  layout,
  link
}`;
