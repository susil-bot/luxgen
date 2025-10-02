/**
 * Training Program Manager Transformers - Test Specifications
 * Unit tests for data transformation functionality
 */

import { TrainingProgramManagerTransformer } from './transformers';

describe('TrainingProgramManagerTransformer', () => {
  describe('transformApiResponseToProgram', () => {
    it('should transform API response to program format', () => {
      const apiData = {
        id: '123',
        title: 'Test Program',
        description: 'Test description',
        category: 'technology',
        level: 'beginner',
        duration: 120,
        status: 'active',
        price: 99.99,
        currency: 'USD',
        tags: ['javascript', 'react'],
        analytics: {
          views: 100,
          enrollments: 50,
          rating: 4.5
        }
      };

      const result = TrainingProgramManagerTransformer.transformApiResponseToProgram(apiData);

      expect(result.id).toBe('123');
      expect(result.title).toBe('Test Program');
      expect(result.category).toBe('technology');
      expect(result.level).toBe('beginner');
      expect(result.duration).toBe(120);
      expect(result.status).toBe('active');
      expect(result.price).toBe(99.99);
      expect(result.currency).toBe('USD');
      expect(result.tags).toEqual(['javascript', 'react']);
      expect(result.analytics.views).toBe(100);
      expect(result.analytics.enrollments).toBe(50);
      expect(result.analytics.rating).toBe(4.5);
    });

    it('should handle missing fields with defaults', () => {
      const apiData = {
        id: '123',
        title: 'Test Program'
      };

      const result = TrainingProgramManagerTransformer.transformApiResponseToProgram(apiData);

      expect(result.id).toBe('123');
      expect(result.title).toBe('Test Program');
      expect(result.description).toBe('');
      expect(result.category).toBe('general');
      expect(result.level).toBe('beginner');
      expect(result.duration).toBe(0);
      expect(result.status).toBe('draft');
      expect(result.price).toBe(0);
      expect(result.currency).toBe('USD');
      expect(result.tags).toEqual([]);
      expect(result.analytics.views).toBe(0);
    });
  });

  describe('transformProgramToFormData', () => {
    it('should transform program to form data', () => {
      const program = {
        id: '123',
        title: 'Test Program',
        description: 'Test description',
        category: 'technology',
        level: 'beginner',
        duration: 120,
        status: 'active',
        price: 99.99,
        currency: 'USD',
        tags: ['javascript', 'react'],
        analytics: { views: 100 },
        metadata: { createdBy: 'user1' },
        settings: { allowEnrollment: true }
      };

      const result = TrainingProgramManagerTransformer.transformProgramToFormData(program);

      expect(result.title).toBe('Test Program');
      expect(result.description).toBe('Test description');
      expect(result.category).toBe('technology');
      expect(result.level).toBe('beginner');
      expect(result.duration).toBe(120);
      expect(result.status).toBe('active');
      expect(result.price).toBe(99.99);
      expect(result.currency).toBe('USD');
      expect(result.tags).toEqual(['javascript', 'react']);
      expect(result.settings.allowEnrollment).toBe(true);
    });
  });

  describe('transformFormDataToApi', () => {
    it('should transform form data to API format', () => {
      const formData = {
        title: 'Test Program',
        description: 'Test description',
        category: 'technology',
        level: 'beginner',
        duration: 120,
        status: 'active',
        price: 99.99,
        currency: 'USD',
        tags: ['javascript', 'react'],
        settings: { allowEnrollment: true }
      };

      const result = TrainingProgramManagerTransformer.transformFormDataToApi(formData);

      expect(result.title).toBe('Test Program');
      expect(result.description).toBe('Test description');
      expect(result.category).toBe('technology');
      expect(result.level).toBe('beginner');
      expect(result.duration).toBe(120);
      expect(result.status).toBe('active');
      expect(result.price).toBe(99.99);
      expect(result.currency).toBe('USD');
      expect(result.tags).toEqual(['javascript', 'react']);
      expect(result.settings.allowEnrollment).toBe(true);
    });
  });

  describe('transformFiltersToApi', () => {
    it('should transform filters to API format', () => {
      const filters = {
        status: 'active',
        category: 'technology',
        level: 'beginner',
        search: 'javascript',
        tags: ['react', 'node'],
        priceRange: { min: 0, max: 100 },
        durationRange: { min: 60, max: 180 },
        isActive: true,
        isPublic: true,
        sortBy: 'title',
        sortOrder: 'asc',
        page: 1,
        limit: 10
      };

      const result = TrainingProgramManagerTransformer.transformFiltersToApi(filters);

      expect(result.status).toBe('active');
      expect(result.category).toBe('technology');
      expect(result.level).toBe('beginner');
      expect(result.search).toBe('javascript');
      expect(result.tags).toEqual(['react', 'node']);
      expect(result.minPrice).toBe(0);
      expect(result.maxPrice).toBe(100);
      expect(result.minDuration).toBe(60);
      expect(result.maxDuration).toBe(180);
      expect(result.isActive).toBe(true);
      expect(result.isPublic).toBe(true);
      expect(result.sortBy).toBe('title');
      expect(result.sortOrder).toBe('asc');
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should handle empty filters', () => {
      const filters = {};
      const result = TrainingProgramManagerTransformer.transformFiltersToApi(filters);
      expect(result).toEqual({});
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(TrainingProgramManagerTransformer.formatDuration(30)).toBe('30 minutes');
      expect(TrainingProgramManagerTransformer.formatDuration(90)).toBe('1h 30m');
      expect(TrainingProgramManagerTransformer.formatDuration(120)).toBe('2 hours');
      expect(TrainingProgramManagerTransformer.formatDuration(1500)).toBe('1d 1h');
      expect(TrainingProgramManagerTransformer.formatDuration(2880)).toBe('2 days');
    });
  });

  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(TrainingProgramManagerTransformer.formatPrice(99.99, 'USD')).toBe('$99.99');
      expect(TrainingProgramManagerTransformer.formatPrice(50, 'EUR')).toBe('€50.00');
      expect(TrainingProgramManagerTransformer.formatPrice(0, 'USD')).toBe('$0.00');
    });
  });

  describe('formatStatus', () => {
    it('should format status correctly', () => {
      expect(TrainingProgramManagerTransformer.formatStatus('active')).toBe('Active');
      expect(TrainingProgramManagerTransformer.formatStatus('draft')).toBe('Draft');
      expect(TrainingProgramManagerTransformer.formatStatus('in_review')).toBe('In review');
    });
  });

  describe('formatLevel', () => {
    it('should format level correctly', () => {
      expect(TrainingProgramManagerTransformer.formatLevel('beginner')).toBe('Beginner');
      expect(TrainingProgramManagerTransformer.formatLevel('intermediate')).toBe('Intermediate');
      expect(TrainingProgramManagerTransformer.formatLevel('advanced')).toBe('Advanced');
    });
  });

  describe('formatCategory', () => {
    it('should format category correctly', () => {
      expect(TrainingProgramManagerTransformer.formatCategory('technology')).toBe('Technology');
      expect(TrainingProgramManagerTransformer.formatCategory('business_skills')).toBe('Business skills');
    });
  });

  describe('calculateEnrollmentProgress', () => {
    it('should calculate enrollment progress correctly', () => {
      const program = {
        currentEnrollments: 25,
        maxEnrollments: 100
      };

      const result = TrainingProgramManagerTransformer.calculateEnrollmentProgress(program);
      expect(result).toBe(25);
    });

    it('should handle zero max enrollments', () => {
      const program = {
        currentEnrollments: 25,
        maxEnrollments: 0
      };

      const result = TrainingProgramManagerTransformer.calculateEnrollmentProgress(program);
      expect(result).toBe(0);
    });
  });

  describe('transformProgramsForTable', () => {
    it('should transform programs for table display', () => {
      const programs = [
        {
          id: '1',
          title: 'Test Program',
          category: 'technology',
          level: 'beginner',
          status: 'active',
          duration: 120,
          price: 99.99,
          currency: 'USD',
          currentEnrollments: 25,
          maxEnrollments: 100,
          analytics: { completionRate: 85, rating: 4.5, views: 1000 },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        }
      ];

      const result = TrainingProgramManagerTransformer.transformProgramsForTable(programs);

      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Test Program');
      expect(result[0].category).toBe('Technology');
      expect(result[0].level).toBe('Beginner');
      expect(result[0].status).toBe('Active');
      expect(result[0].duration).toBe('2 hours');
      expect(result[0].price).toBe('$99.99');
      expect(result[0].enrollments).toBe('25/100');
      expect(result[0].completionRate).toBe('85%');
      expect(result[0].rating).toBe('4.5');
      expect(result[0].views).toBe(1000);
    });
  });

  describe('transformProgramsForCards', () => {
    it('should transform programs for card display', () => {
      const programs = [
        {
          id: '1',
          title: 'Test Program',
          description: 'Test description',
          shortDescription: 'Short description',
          category: 'technology',
          level: 'beginner',
          status: 'active',
          duration: 120,
          price: 99.99,
          currency: 'USD',
          currentEnrollments: 25,
          maxEnrollments: 100,
          analytics: { rating: 4.5, totalRatings: 100 },
          isActive: true,
          isPublic: true,
          isFeatured: false
        }
      ];

      const result = TrainingProgramManagerTransformer.transformProgramsForCards(programs);

      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Test Program');
      expect(result[0].description).toBe('Short description');
      expect(result[0].category).toBe('technology');
      expect(result[0].level).toBe('beginner');
      expect(result[0].status).toBe('active');
      expect(result[0].duration).toBe('2 hours');
      expect(result[0].price).toBe('$99.99');
      expect(result[0].enrollmentProgress).toBe(25);
      expect(result[0].rating).toBe(4.5);
      expect(result[0].totalRatings).toBe(100);
      expect(result[0].isActive).toBe(true);
      expect(result[0].isPublic).toBe(true);
      expect(result[0].isFeatured).toBe(false);
    });
  });

  describe('transformSearchResults', () => {
    it('should transform search results', () => {
      const results = [
        {
          id: '1',
          title: 'JavaScript Program',
          description: 'Learn JavaScript',
          category: 'technology',
          level: 'beginner',
          status: 'active',
          duration: 120,
          price: 99.99,
          currency: 'USD',
          thumbnail: 'thumb.jpg',
          tags: ['javascript'],
          relevanceScore: 0.95,
          highlights: ['javascript', 'programming']
        }
      ];

      const result = TrainingProgramManagerTransformer.transformSearchResults(results);

      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('JavaScript Program');
      expect(result[0].description).toBe('Learn JavaScript');
      expect(result[0].category).toBe('technology');
      expect(result[0].level).toBe('beginner');
      expect(result[0].status).toBe('active');
      expect(result[0].duration).toBe('2 hours');
      expect(result[0].price).toBe('$99.99');
      expect(result[0].thumbnail).toBe('thumb.jpg');
      expect(result[0].tags).toEqual(['javascript']);
      expect(result[0].relevanceScore).toBe(0.95);
      expect(result[0].highlights).toEqual(['javascript', 'programming']);
    });
  });
});
