import { ReactNode } from 'react';

export interface EnrolmentType {
  id: string;
  title: string;
  isDisabled: boolean;
  html: ReactNode;
  isCompleted: boolean;
  desc?: string;
}
