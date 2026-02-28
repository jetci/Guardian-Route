/**
 * Comprehensive Survey API Client
 * Handles 8-step detailed survey submissions
 */

import { apiClient } from './client';
import type { SurveyData } from '../types/survey';

export interface ComprehensiveSurveyResponse {
    id: string;
    fieldOfficerId: string;
    taskId?: string;
    villageId: string;
    villageName: string;
    disasterType: string;
    surveyDate: string;
    gpsLocation: { lat: number; lng: number };
    affectedHouseholds: number;
    affectedPeople: number;
    deadCount: number;
    missingCount: number;
    injuredCount: number;
    evacuatedPeople: number;
    evacuatedHouseholds: number;
    damageAssessment: any;
    reliefData?: any;
    resourcesData?: any;
    operationsData?: any;
    reportType: string;
    photoUrls: string[];
    polygon?: any;
    notes?: string;
    status: string;
    submittedAt: string;
    updatedAt: string;
}

export const comprehensiveSurveyApi = {
    /**
     * Submit a comprehensive survey (8 steps)
     */
    async submitSurvey(data: SurveyData): Promise<ComprehensiveSurveyResponse> {
        // Transform SurveyData to API format
        const payload = {
            taskId: data.taskId,
            villageId: data.villageId,
            villageName: data.villageName,
            disasterType: data.disasterType,
            surveyDate: data.surveyDate,
            gpsLocation: data.gpsLocation || { lat: 0, lng: 0 },

            // Step 2: Affected People
            affectedHouseholds: data.affectedHouseholds,
            affectedPeople: data.affectedPeople,
            deadCount: data.deadCount,
            missingCount: data.missingCount,
            injuredCount: data.injuredCount,
            evacuatedPeople: data.evacuatedPeople,
            evacuatedHouseholds: data.evacuatedHouseholds,

            // Step 3: Damage Assessment
            damageAssessment: {
                buildings: {
                    partial: data.damagedHousesPartial,
                    full: data.damagedHousesFull,
                    highRise: data.damagedHighRise,
                    factories: data.damagedFactories,
                    temples: data.damagedTemples,
                    govtPlaces: data.damagedGovtPlaces,
                    other: data.damagedOther,
                    estimatedDamage: data.estimatedBuildingDamage
                },
                agriculture: {
                    cropRai: data.cropRai,
                    riceRai: data.riceRai,
                    orchardRai: data.orchardRai,
                    fishPonds: data.fishPonds,
                    shrimpPonds: data.shrimpPonds,
                    livestockCows: data.livestockCows,
                    livestockPigs: data.livestockPigs,
                    livestockPoultry: data.livestockPoultry,
                    livestockOther: data.livestockOther,
                    estimatedDamage: data.estimatedAgriDamage
                },
                utilities: {
                    roadsAgri: data.roadsAgri,
                    weirs: data.weirs,
                    bridgeNecks: data.bridgeNecks,
                    bridges: data.bridges,
                    dams: data.dams,
                    dikes: data.dikes,
                    landslides: data.landslides,
                    other: data.utilityOther,
                    estimatedDamage: data.estimatedUtilityDamage
                }
            },

            // Step 4: Relief
            reliefOperations: data.reliefOperations,

            // Step 5: Resources
            resourcesData: {
                waterTrucks: data.waterTrucks,
                rescueTrucks: data.rescueTrucks,
                boats: data.boats,
                cars: data.cars,
                pumps: data.pumps,
                backhoes: data.backhoes,
                trucks6Wheel: data.trucks6Wheel,
                loaders: data.loaders,
                chainsaws: data.chainsaws,
                cranes: data.cranes,
                govtAgenciesCount: data.govtAgenciesCount,
                privateGroupsCount: data.privateGroupsCount,
                volunteersCount: data.volunteersCount
            },

            // Step 6: Operations
            operationsData: data.involvedAgencies,

            // Step 7: Certification
            reportType: data.reportType,

            // Additional
            photoUrls: data.photoUrls,
            polygon: data.polygon
        };

        const response = await apiClient.post('/field-officer/comprehensive-surveys', payload);
        return response.data;
    },

    /**
     * Get all comprehensive surveys submitted by current field officer
     */
    async getMySurveys(): Promise<ComprehensiveSurveyResponse[]> {
        const response = await apiClient.get('/field-officer/comprehensive-surveys/my-surveys');
        return response.data;
    },

    /**
     * Get a specific comprehensive survey by ID
     */
    async getSurveyById(surveyId: string): Promise<ComprehensiveSurveyResponse> {
        const response = await apiClient.get(`/field-officer/comprehensive-surveys/${surveyId}`);
        return response.data;
    },
};
