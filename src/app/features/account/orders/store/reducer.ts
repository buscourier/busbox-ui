import { createReducer, on } from '@ngrx/store';

import { AsyncStatus, LoadingStatus } from '@shared/types';

import { DEFAULT_PAGE } from '../constants';
import { SortDirectionEnum } from '../types';

import { OrdersActions } from './actions';
import { adapter, initialState, type OrdersFeatureState } from './state';

export const ordersReducer = createReducer(
  initialState,
  on(
    OrdersActions.loadList,
    (state): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        status: AsyncStatus.LOADING, // ← используйте AsyncStatus
        error: null,
      },
    }),
  ),

  on(
    OrdersActions.loadListSuccess,
    (state, { response }): OrdersFeatureState => ({
      ...state,
      list: adapter.setAll(response.orders, {
        ...state.list,
        status: AsyncStatus.LOADED,
        totalCount: Number(response.rows) || 0,
      }),
    }),
  ),

  on(
    OrdersActions.loadListFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        status: AsyncStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    OrdersActions.selectOrder,
    (state, { orderId }): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        selectedId: orderId,
      },
    }),
  ),
  on(
    OrdersActions.clearSelection,
    (state): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        selectedId: null,
      },
    }),
  ),

  on(
    OrdersActions.loadDetails,
    (state): OrdersFeatureState => ({
      ...state,
      details: {
        ...state.details,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    OrdersActions.loadDetailsSuccess,
    (state, { data }): OrdersFeatureState => ({
      ...state,
      details: {
        ...state.details,
        status: LoadingStatus.LOADED,
        data,
      },
    }),
  ),
  on(
    OrdersActions.loadDetailsFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      details: {
        ...state.details,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    OrdersActions.cancel,
    (state): OrdersFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        cancel: {
          ...state.operations.cancel,
          status: LoadingStatus.LOADING,
          error: null,
        },
      },
    }),
  ),
  on(
    OrdersActions.cancelSuccess,
    (state): OrdersFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        cancel: {
          ...state.operations.cancel,
          status: LoadingStatus.LOADED,
          // data: ???
        },
      },
    }),
  ),
  on(
    OrdersActions.cancelFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        cancel: {
          ...state.operations.cancel,
          status: LoadingStatus.ERROR,
          error,
        },
      },
    }),
  ),

  on(
    OrdersActions.setPage,
    (state, { page }): OrdersFeatureState => ({
      ...state,
      query: {
        ...state.query,
        pagination: {
          ...state.query.pagination,
          currentPage: page,
        },
      },
    }),
  ),

  on(
    OrdersActions.setPageSize,
    (state, { pageSize }): OrdersFeatureState => ({
      ...state,
      query: {
        ...state.query,
        pagination: {
          ...state.query.pagination,
          pageSize,
        },
      },
    }),
  ),
  on(
    OrdersActions.setFilter,
    (state, { filter }): OrdersFeatureState => ({
      ...state,
      query: {
        ...state.query,
        filter,
        pagination: {
          ...state.query.pagination,
          currentPage: DEFAULT_PAGE,
        },
      },
    }),
  ),
  on(
    OrdersActions.clearFilter,
    (state): OrdersFeatureState => ({
      ...state,
      query: {
        ...state.query,
        filter: {
          pickupCity: null,
          deliveryCity: null,
          range: null,
        },
        pagination: {
          ...state.query.pagination,
          currentPage: DEFAULT_PAGE,
        },
      },
    }),
  ),

  on(
    OrdersActions.exportToExcel,
    (state): OrdersFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        export: {
          ...state.operations.export,
          status: AsyncStatus.LOADING,
          error: null,
        },
      },
    }),
  ),
  on(
    OrdersActions.exportToExcelSuccess,
    (state): OrdersFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        export: {
          ...state.operations.export,
          status: AsyncStatus.LOADED,
          // data: ???
        },
      },
    }),
  ),
  on(
    OrdersActions.exportToExcelFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        export: {
          ...state.operations.export,
          status: AsyncStatus.ERROR,
          error,
        },
      },
    }),
  ),
  on(
    OrdersActions.setSort,
    (state, { sort }): OrdersFeatureState => ({
      ...state,
      query: {
        ...state.query,
        sort,
        pagination: {
          ...state.query.pagination,
          currentPage: DEFAULT_PAGE,
        },
      },
    }),
  ),
  on(
    OrdersActions.clearSort,
    (state): OrdersFeatureState => ({
      ...state,
      query: {
        ...state.query,
        sort: {
          field: null,
          direction: SortDirectionEnum.NONE,
        },
        pagination: {
          ...state.query.pagination,
          currentPage: DEFAULT_PAGE,
        },
      },
    }),
  ),
);
