import {FieldValues, UseFormProps} from 'react-hook-form';
import {FormData} from './template';

export type TypedUseFormProps<T extends FieldValues> = Omit<UseFormProps<T>, 'defaultValues'> & {
  defaultValues: T;
};

export type FormProps = TypedUseFormProps<FormData>;
