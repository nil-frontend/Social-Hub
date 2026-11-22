export interface YouTubeCategory {
  id: string;
  name: string;
}

export const YOUTUBE_CATEGORIES: YouTubeCategory[] = [
  { id: "22", name: "People & Blogs (Default)" },
  { id: "24", name: "Entertainment" },
  { id: "28", name: "Science & Technology" },
  { id: "27", name: "Education" },
  { id: "20", name: "Gaming" },
  { id: "26", name: "Howto & Style" },
  { id: "10", name: "Music" },
  { id: "23", name: "Comedy" },
  { id: "25", name: "News & Politics" },
  { id: "17", name: "Sports" },
  { id: "1", name: "Film & Animation" },
  { id: "2", name: "Autos & Vehicles" },
  { id: "15", name: "Pets & Animals" },
  { id: "19", name: "Travel & Events" },
];

export function getCategoryName(id: string): string {
  const category = YOUTUBE_CATEGORIES.find((c) => c.id === id);
  return category ? category.name : "People & Blogs";
}
