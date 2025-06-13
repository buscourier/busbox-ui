import type { ApiError } from './api-error.types';

export const AsyncStatus = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR',
};

export type AsyncStatus = (typeof AsyncStatus)[keyof typeof AsyncStatus];

export interface AsyncState<T = unknown> {
  status: AsyncStatus;
  data: T;
  error: ApiError | null;
}
