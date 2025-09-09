// export const INDIVIDUAL_ROLE = {
//   SENDER: 'SENDER',
//   RECIPIENT: 'RECIPIENT',
// } as const;
//
// export type Role = 'sender' | 'recipient';

// Temporary trash !!!!!!
export enum IndividualType {
  SENDER = 'sender',
  RECIPIENT = 'recipient',
}

export interface IndividualRole {
  value: IndividualType;
  label: 'Отправитель' | 'Получатель';
}
// Temporary trash !!!!!!!

export interface Individual {
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  phone: string;
  role: IndividualRole;
}
