import {
  Professional,
  ProfessionalSearchFilters,
  ServiceCategory,
  ServiceSpecialty,
} from '@/src/features/services/types';

export interface ServicesDataSource {
  getCategories(): Promise<ServiceCategory[]>;
  getSpecialties(): Promise<ServiceSpecialty[]>;
  getProfessionals(): Promise<Professional[]>;
  getProfessionalById(id: string): Promise<Professional | null>;
}

const categories: ServiceCategory[] = [
  { id: 'health', name: 'Santé', description: 'Accompagnement médical et prévention' },
  { id: 'sport-wellness', name: 'Sport & Bien-être', description: 'Remise en forme, récupération et équilibre' },
  { id: 'beauty', name: 'Beauté', description: 'Soins esthétiques et image personnelle' },
  { id: 'nutrition', name: 'Nutrition', description: 'Accompagnement alimentaire et hygiène de vie' },
  { id: 'mental-health', name: 'Santé mentale', description: 'Écoute, soutien et mieux-être psychologique' },
  { id: 'home-services', name: 'Services à domicile', description: 'Prestations réalisées chez vous' },
  { id: 'other-services', name: 'Autres services', description: 'Services complémentaires' },
];

const specialties: ServiceSpecialty[] = [
  { id: 'medecin-generaliste', categoryId: 'health', name: 'Médecin généraliste' },
  { id: 'pediatre', categoryId: 'health', name: 'Pédiatre' },
  { id: 'gynecologue', categoryId: 'health', name: 'Gynécologue' },
  { id: 'dentiste', categoryId: 'health', name: 'Dentiste' },
  { id: 'infirmier', categoryId: 'health', name: 'Infirmier / Infirmière' },
  { id: 'kine', categoryId: 'health', name: 'Kinésithérapie' },
  { id: 'cardiologue', categoryId: 'health', name: 'Cardiologue' },
  { id: 'dermatologue', categoryId: 'health', name: 'Dermatologue' },
  { id: 'orl', categoryId: 'health', name: 'ORL' },
  { id: 'autres-sante', categoryId: 'health', name: 'Autres spécialités' },
  { id: 'coaching-sportif', categoryId: 'sport-wellness', name: 'Coaching sportif' },
  { id: 'massage-sportif', categoryId: 'sport-wellness', name: 'Massage sportif' },
  { id: 'reflexologie', categoryId: 'sport-wellness', name: 'Réflexologie' },
  { id: 'esthetique-visage', categoryId: 'beauty', name: 'Soin visage' },
  { id: 'manucure', categoryId: 'beauty', name: 'Manucure' },
  { id: 'nutrition-clinique', categoryId: 'nutrition', name: 'Nutrition clinique' },
  { id: 'reeducation-alimentaire', categoryId: 'nutrition', name: 'Rééducation alimentaire' },
  { id: 'psychologue', categoryId: 'mental-health', name: 'Psychologue' },
  { id: 'coach-vie', categoryId: 'mental-health', name: 'Coach de vie' },
  { id: 'soins-domicile', categoryId: 'home-services', name: 'Soins à domicile' },
  { id: 'assistance-domicile', categoryId: 'home-services', name: 'Assistance à domicile' },
  { id: 'autres-services', categoryId: 'other-services', name: 'Autres services' },
];

const professionals: Professional[] = [
  {
    id: 'pro-1',
    fullName: 'Amina Traoré',
    headline: 'Coach sportive & mobilité',
    biography: 'Spécialisée dans la remise en forme et la mobilité fonctionnelle. Accompagnement progressif avec plan personnalisé.',
    rating: 4.8,
    reviewCount: 126,
    categoryIds: ['sport-wellness', 'nutrition'],
    specialtyIds: ['coaching-sportif', 'nutrition-clinique'],
    location: {
      latitude: 5.3364,
      longitude: -4.0267,
      address: 'Cocody, Rue des Jardins',
      city: 'Abidjan',
      distanceKm: 1.2,
    },
    availability: {
      nextSlotLabel: 'Aujourd’hui 18:30',
      acceptsNewRequests: true,
    },
    offerings: [
      { id: 'off-1', title: 'Bilan forme initial', durationMinutes: 45, fromPrice: 20000, modes: ['cabinet', 'online'] },
      { id: 'off-2', title: 'Séance coaching personnalisée', durationMinutes: 60, fromPrice: 25000, modes: ['cabinet', 'domicile', 'online'] },
    ],
  },
  {
    id: 'pro-2',
    fullName: 'Kevin N’Dri',
    headline: 'Kinésithérapeute du sport',
    biography: 'Prise en charge des douleurs articulaires et récupération post-effort. Approche orientée résultat et prévention des récidives.',
    rating: 4.6,
    reviewCount: 89,
    categoryIds: ['health', 'sport-wellness'],
    specialtyIds: ['kine', 'massage-sportif'],
    location: {
      latitude: 5.3541,
      longitude: -3.9982,
      address: 'Plateau, Avenue Chardy',
      city: 'Abidjan',
      distanceKm: 3.8,
    },
    availability: {
      nextSlotLabel: 'Demain 09:00',
      acceptsNewRequests: true,
    },
    offerings: [
      { id: 'off-3', title: 'Consultation kiné', durationMinutes: 50, fromPrice: 30000, modes: ['cabinet'] },
      { id: 'off-4', title: 'Massage récupération', durationMinutes: 40, fromPrice: 18000, modes: ['cabinet', 'domicile'] },
    ],
  },
  {
    id: 'pro-3',
    fullName: 'Sophie Mensah',
    headline: 'Esthéticienne à domicile',
    biography: 'Soins visage et routines beauté adaptées à votre type de peau. Interventions rapides en soirée et week-end.',
    rating: 4.9,
    reviewCount: 201,
    categoryIds: ['beauty', 'home-services'],
    specialtyIds: ['esthetique-visage', 'manucure', 'soins-domicile'],
    location: {
      latitude: 5.3271,
      longitude: -4.0066,
      address: 'Marcory, Zone 4',
      city: 'Abidjan',
      distanceKm: 2.4,
    },
    availability: {
      nextSlotLabel: 'Aujourd’hui 20:15',
      acceptsNewRequests: true,
    },
    offerings: [
      { id: 'off-5', title: 'Soin éclat visage', durationMinutes: 35, fromPrice: 15000, modes: ['domicile', 'cabinet'] },
      { id: 'off-6', title: 'Manucure express', durationMinutes: 30, fromPrice: 10000, modes: ['domicile'] },
    ],
  },
  {
    id: 'pro-4',
    fullName: 'Yao Koffi',
    headline: 'Praticien bien-être',
    biography: 'Relaxation, respiration et réflexologie pour réduire le stress et améliorer la récupération après travail intense.',
    rating: 4.5,
    reviewCount: 64,
    categoryIds: ['sport-wellness', 'mental-health'],
    specialtyIds: ['reflexologie', 'coach-vie'],
    location: {
      latitude: 5.2985,
      longitude: -3.9872,
      address: 'Treichville, Boulevard de Marseille',
      city: 'Abidjan',
      distanceKm: 6.1,
    },
    availability: {
      nextSlotLabel: 'Vendredi 11:00',
      acceptsNewRequests: false,
    },
    offerings: [
      { id: 'off-7', title: 'Séance réflexologie', durationMinutes: 50, fromPrice: 22000, modes: ['cabinet'] },
    ],
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockServicesSource implements ServicesDataSource {
  async getCategories(): Promise<ServiceCategory[]> {
    await wait(120);
    return categories;
  }

  async getSpecialties(): Promise<ServiceSpecialty[]> {
    await wait(120);
    return specialties;
  }

  async getProfessionals(): Promise<Professional[]> {
    await wait(150);
    return professionals;
  }

  async getProfessionalById(id: string): Promise<Professional | null> {
    await wait(120);
    return professionals.find((item) => item.id === id) || null;
  }
}

export function matchesFilters(item: Professional, filters: ProfessionalSearchFilters): boolean {
  const normalizedQuery = filters.query.trim().toLowerCase();

  if (normalizedQuery.length > 0) {
    const indexable = [
      item.fullName,
      item.headline,
      item.biography,
      item.location.city,
      item.location.address,
    ]
      .join(' ')
      .toLowerCase();

    if (!indexable.includes(normalizedQuery)) {
      return false;
    }
  }

  if (filters.categoryId && !item.categoryIds.includes(filters.categoryId)) {
    return false;
  }

  if (filters.specialtyId && !item.specialtyIds.includes(filters.specialtyId)) {
    return false;
  }

  if (filters.mode && !item.offerings.some((offer) => offer.modes.includes(filters.mode!))) {
    return false;
  }

  if (typeof filters.maxDistanceKm === 'number' && item.location.distanceKm > filters.maxDistanceKm) {
    return false;
  }

  return true;
}
