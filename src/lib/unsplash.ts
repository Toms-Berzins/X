import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.VITE_UNSPLASH_ACCESS_KEY || '',
});

export const getStockImages = async (query: string, page: number = 1, perPage: number = 30) => {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      page,
      perPage,
    });

    if (result.errors) {
      console.error('Error fetching images from Unsplash:', result.errors);
      return [];
    }

    return result.response?.results.map(photo => ({
      id: photo.id,
      title: photo.description || photo.alt_description || 'Untitled',
      category: 'stock',
      image: photo.urls.regular,
      description: `Photo by ${photo.user.name} on Unsplash`,
      thumb: photo.urls.thumb,
      download: photo.links.download,
    })) || [];
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
}; 