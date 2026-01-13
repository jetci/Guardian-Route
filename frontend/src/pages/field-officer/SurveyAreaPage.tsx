import { useParams } from 'react-router-dom';
import SurveyLandingPage from './survey/SurveyLandingPage';
import SurveyWizardPage from './survey/SurveyWizardPage';

/**
 * Survey Area Entry Point
 * Routes to either the Landing Page (Task Selection) or the Wizard (if Task ID present)
 */
export default function SurveyAreaPage() {
  const { taskId } = useParams<{ taskId: string }>();

  if (taskId) {
    return <SurveyWizardPage />;
  }

  return <SurveyLandingPage />;
}
