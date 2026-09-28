import {
  Professional,
  ProfessionalSearchFilters,
  ServiceCategory,
  ServiceSpecialty,
} from '@/src/features/services/types';
import { matchesFilters, MockServicesSource, ServicesDataSource } from '@/src/features/services/data/mockServicesSource';
import {
  getFavoriteIdsSnapshot,
  hydrateFavorites,
  toggleFavoriteProfessional,
} from '@/src/features/services/stores/servicesFavoritesStore';

export class ServicesService {
  private source: ServicesDataSource;

  constructor(source: ServicesDataSource) {
    this.source = source;
  }

  async getCategories(): Promise<ServiceCategory[]> {
    return this.source.getCategories();
  }

  async getSpecialties(): Promise<ServiceSpecialty[]> {
    return this.source.getSpecialties();
  }

  async searchProfessionals(filters: ProfessionalSearchFilters): Promise<Professional[]> {
    const all = await this.source.getProfessionals();
    return all.filter((item) => matchesFilters(item, filters));
  }

  async getProfessionalById(id: string): Promise<Professional | null> {
    return this.source.getProfessionalById(id);
  }

  async getFavoriteIds(): Promise<string[]> {
    await hydrateFavorites();
    return getFavoriteIdsSnapshot();
  }

  async toggleFavorite(professionalId: string): Promise<string[]> {
    return toggleFavoriteProfessional(professionalId);
  }
}

export const servicesService = new ServicesService(new MockServicesSource());
