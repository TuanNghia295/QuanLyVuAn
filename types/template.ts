import {FieldValues} from 'react-hook-form';

export interface Template {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  groups: Group[];
}

export interface Group {
  id: string;
  templateId: string;
  title: string;
  description: string | null;
  isEdit: boolean;
  index: number;
  createdAt: string;
  fields: Field[];
}

export interface Field {
  id: string;
  groupId: string;
  fieldLabel: string;
  fieldName: string;
  fieldType: 'text' | 'textarea' | 'select' | 'date';
  isRequired: boolean;
  placeholder: string | null;
  options: string[];
  defaultValue: string | null;
  isEdit: boolean;
  index: number;
  description: string | null;
}

export interface FormData extends FieldValues {
  title: string;
  description: string;
  decisionDate: string;
  endDate: string;
  officer: string;
  status: string;
  templateId: string;
  groups: {
    id: string;
    fields: {
      id: string;
      value: string;
      isRequired: boolean;
    }[];
  }[];
}
