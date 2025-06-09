import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import { DEFAULT_PAGE } from '../constants';

import { OrdersActions } from './actions';
import { initialState, type OrdersFeatureState } from './state';

export const ordersReducer = createReducer(
  initialState,
  on(
    OrdersActions.getOrderList,
    (state): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    OrdersActions.getOrderListSuccess,
    (state, { response }): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        status: LoadingStatus.LOADED,
        orders: response.orders,
        totalCount: response.rows,
      },
    }),
  ),
  on(
    OrdersActions.getOrderListFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      list: {
        ...state.list,
        status: LoadingStatus.ERROR,
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
    OrdersActions.getOrder,
    (state): OrdersFeatureState => ({
      ...state,
      order: {
        ...state.order,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    OrdersActions.getOrderSuccess,
    (state, { details }): OrdersFeatureState => ({
      ...state,
      order: {
        ...state.order,
        status: LoadingStatus.LOADED,
        details,
      },
    }),
  ),
  on(
    OrdersActions.getOrderFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      order: {
        ...state.order,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    OrdersActions.cancelOrder,
    (state): OrdersFeatureState => ({
      ...state,
      order: {
        ...state.order,
        isCanceling: true,
        cancelError: null,
      },
    }),
  ),
  on(
    OrdersActions.cancelOrderSuccess,
    (state): OrdersFeatureState => ({
      ...state,
      order: {
        ...state.order,
        isCanceling: false,
      },
    }),
  ),
  on(
    OrdersActions.cancelOrderFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      order: {
        ...state.order,
        isCanceling: false,
        cancelError: error,
      },
    }),
  ),

  on(
    OrdersActions.setCurrentPage,
    (state, { page }): OrdersFeatureState => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: page,
      },
    }),
  ),

  on(
    OrdersActions.setPageSize,
    (state, { pageSize }): OrdersFeatureState => ({
      ...state,
      pagination: {
        ...state.pagination,
        pageSize,
        // currentPage: DEFAULT_PAGE, //!!!!!
      },
    }),
  ),

  on(
    OrdersActions.clearFilter,
    (state): OrdersFeatureState => ({
      ...state,
      filter: {
        range: null,
        pickupCity: null,
        deliveryCity: null,
      },
      pagination: {
        ...state.pagination,
        currentPage: DEFAULT_PAGE,
      },
    }),
  ),

  on(
    OrdersActions.setFilter,
    (state, { filter }): OrdersFeatureState => ({
      ...state,
      filter,
      pagination: {
        ...state.pagination,
        currentPage: DEFAULT_PAGE,
      },
    }),
  ),
  on(
    OrdersActions.exportOrdersToExcel,
    (state): OrdersFeatureState => ({
      ...state,
      export: {
        ...state.export,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    OrdersActions.exportOrdersToExcelSuccess,
    (state): OrdersFeatureState => ({
      ...state,
      export: {
        ...state.export,
        status: LoadingStatus.LOADED,
      },
    }),
  ),
  on(
    OrdersActions.exportOrdersToExcelFailure,
    (state, { error }): OrdersFeatureState => ({
      ...state,
      export: {
        ...state.export,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),
);
