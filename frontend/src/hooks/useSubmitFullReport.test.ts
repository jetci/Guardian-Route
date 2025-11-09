import { renderHook, act } from '@testing-library/react-hooks';
import { useSubmitFullReport } from './useSubmitFullReport';
import { FullReportFormData } from '../types/full-report';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const mockValidData: FullReportFormData = {
  reportTitle: 'Valid Report Title',
  executiveSummary: 'This is a valid executive summary with more than fifty characters.',
  photoUrls: ['http://example.com/image.jpg'],
  aiAnalysis: { damageLevel: 'High', affectedStructures: 'Many', estimatedAffectedArea: 1000, visibleHazards: 'None', recommendations: 'Evacuate' },
  recommendations: 'This is a very long and detailed recommendation that is definitely over one hundred characters long to pass validation.',
  policyRecommendations: 'This is a very long and detailed policy recommendation that is definitely over one hundred characters long to pass validation.',
  futurePreventionMeasures: 'This is a very long and detailed future prevention measure that is definitely over one hundred characters long to pass validation.',
  // Add other required fields with default values
  severity: 'High',
  damageCategories: ['Buildings'],
  estimatedDamageCost: 100000,
  affectedHouseholds: 10,
  affectedPopulation: 50,
  evacuatedPeople: 20,
  infrastructureDamage: ['Roads'],
  casualties: 0,
  injuries: 0,
  missing: 0,
  urgentPriorityItems: [],
  respondingAgencies: [],
};

describe('useSubmitFullReport', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    localStorage.clear();
  });

  it('should validate data successfully before submission', () => {
    const { result } = renderHook(() => useSubmitFullReport());
    const validationError = result.current.validateBeforeSubmit(mockValidData);
    expect(validationError).toBeNull();
  });

  it('should fail validation if report title is too short', () => {
    const { result } = renderHook(() => useSubmitFullReport());
    const invalidData = { ...mockValidData, reportTitle: 'Short' };
    const validationError = result.current.validateBeforeSubmit(invalidData);
    expect(validationError).toContain('หัวข้อรายงาน');
  });

  it('should fail validation if AI analysis is missing with photos', () => {
    const { result } = renderHook(() => useSubmitFullReport());
    const invalidData = { ...mockValidData, aiAnalysis: undefined };
    const validationError = result.current.validateBeforeSubmit(invalidData);
    expect(validationError).toContain('AI');
  });

  it('should submit successfully and redirect', async () => {
    const { result } = renderHook(() => useSubmitFullReport());
    const taskId = 'task-123';

    let submitResult;
    await act(async () => {
      submitResult = await result.current.submitAndRedirect({ taskId, formData: mockValidData });
    });

    expect(submitResult.success).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
    expect(localStorage.getItem(`wizard-draft-${taskId}`)).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith(`/tasks/${taskId}`, { state: { message: 'ส่งรายงานสำเร็จ' } });
  });

  it('should handle submission failure', async () => {
    // Mock API to throw an error
    // For this test, we can just modify the hook to simulate an error
    const { result } = renderHook(() => useSubmitFullReport());
    const taskId = 'task-123';

    // Mocking a failure by providing invalid data
    const invalidData = { ...mockValidData, reportTitle: '' };

    let submitResult;
    await act(async () => {
      submitResult = await result.current.submitAndRedirect({ taskId, formData: invalidData });
    });

    expect(submitResult.success).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
