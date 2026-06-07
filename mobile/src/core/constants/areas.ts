// Life areas — matches SPEC §6.2 + DB enum area_kind

import type { ImageSourcePropType } from 'react-native';

export type AreaKind = 'career' | 'health' | 'love' | 'finance' | 'joy' | 'custom';

export interface AreaDef {
  key: AreaKind;
  label: string;
  sub: string;
  thumb: ImageSourcePropType;
}

export const AREAS: AreaDef[] = [
  {
    key: 'career',
    label: 'Career',
    sub: 'work, what you\'re building',
    thumb: require('@/assets/images/library/work-paris.jpg'),
  },
  {
    key: 'health',
    label: 'Health',
    sub: 'body, energy, sleep',
    thumb: require('@/assets/images/library/health-runner.jpg'),
  },
  {
    key: 'love',
    label: 'Love',
    sub: 'relationships, family, dating',
    thumb: require('@/assets/images/library/love-hero.jpg'),
  },
  {
    key: 'finance',
    label: 'Finance',
    sub: 'money, freedom, security',
    thumb: require('@/assets/images/library/work-window.jpg'),
  },
  {
    key: 'joy',
    label: 'Joy',
    sub: 'play, hobbies, what lights you up',
    thumb: require('@/assets/images/library/work-coffee.jpg'),
  },
];

export const AREA_BY_KEY = Object.fromEntries(AREAS.map(a => [a.key, a])) as Record<
  Exclude<AreaKind, 'custom'>,
  AreaDef
>;

export function areaLabel(key: AreaKind, customLabel?: string): string {
  if (key === 'custom') return customLabel ?? 'Custom';
  return AREA_BY_KEY[key].label;
}
