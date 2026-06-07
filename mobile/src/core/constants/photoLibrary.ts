// Photo library — curated set used by O09 (Choose photographs).
// In Phase C.5 this will be replaced by ~200 photos served from
// Supabase Storage filtered by area. For Phase B.2 we ship a small
// bundled set so the picker is fully functional before backend lands.

import type { ImageSourcePropType } from 'react-native';
import type { AreaKind } from './areas';

export interface LibraryPhoto {
  id: string;
  area: AreaKind;
  /** "tags" = which area filters this photo also surfaces under, in addition to its primary area. */
  tags?: AreaKind[];
  source: ImageSourcePropType;
}

export const PHOTOS: LibraryPhoto[] = [
  // Career
  { id: 'work-paris', area: 'career', source: require('@/assets/images/library/work-paris.jpg'), tags: ['finance'] },
  { id: 'work-window', area: 'career', source: require('@/assets/images/library/work-window.jpg'), tags: ['finance'] },
  { id: 'work-coffee', area: 'career', source: require('@/assets/images/library/work-coffee.jpg'), tags: ['joy'] },
  { id: 'work-laptop', area: 'career', source: require('@/assets/images/library/work-laptop.jpg') },
  { id: 'work-plant', area: 'career', source: require('@/assets/images/library/work-plant.jpg'), tags: ['joy'] },
  { id: 'work-beach', area: 'career', source: require('@/assets/images/library/work-beach.jpg'), tags: ['joy'] },
  // Health
  { id: 'health-runner', area: 'health', source: require('@/assets/images/library/health-runner.jpg') },
  { id: 'health-yoga', area: 'health', source: require('@/assets/images/library/health-yoga.jpg') },
  { id: 'health-medal', area: 'health', source: require('@/assets/images/library/health-medal.jpg') },
  { id: 'health-shoes', area: 'health', source: require('@/assets/images/library/health-shoes.jpg') },
  // Love
  { id: 'love-hero', area: 'love', source: require('@/assets/images/library/love-hero.jpg') },
  // Joy / generic warm
  { id: 'warm-bright', area: 'joy', source: require('@/assets/images/library/hero-warm-bright.jpg'), tags: ['love', 'finance'] },
];

/**
 * Returns photos relevant to the chosen area. A photo matches if its
 * primary `area` equals the chosen area OR if `area` is in its `tags`.
 * For 'custom' area or null, returns the whole library.
 */
export function photosForArea(area: AreaKind | null): LibraryPhoto[] {
  if (!area || area === 'custom') return PHOTOS;
  return PHOTOS.filter(p => p.area === area || p.tags?.includes(area));
}

export function photoById(id: string): LibraryPhoto | undefined {
  return PHOTOS.find(p => p.id === id);
}
