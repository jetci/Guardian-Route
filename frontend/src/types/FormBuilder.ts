export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'date'
  | 'time';

export interface FormField {
  id: string; // Unique ID for the field (e.g., timestamp or UUID)
  name: string; // Unique name for the field (used as key in response data)
  label: string; // Display label for the field
  type: FieldType; // Type of input field
  required: boolean; // Whether the field is required
  options?: string[]; // Options for select, radio, checkboxGroup
  // Add more properties as needed (e.g., min/max for number, placeholder)
}
