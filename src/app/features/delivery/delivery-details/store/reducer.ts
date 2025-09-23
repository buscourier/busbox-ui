import { createReducer, on } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';

import { LoadingStatus } from '@shared/types';

import { CargoType, type Order } from '../types';

import { DeliveryDetailsActions, OrderActions } from './actions';
import type { DeliveryDetailsState } from './state';
import { adapter, initialState } from './state';

export const deliveryDetailsReducer = createReducer(
  initialState,

  on(
    DeliveryDetailsActions.loadOptions,
    (state): DeliveryDetailsState => ({
      ...state,
      options: {
        status: LoadingStatus.LOADING,
        data: null,
        error: null,
      },
    }),
  ),
  on(
    DeliveryDetailsActions.loadOptionsSuccess,
    (state, { options }): DeliveryDetailsState => ({
      ...state,
      options: {
        ...state.options,
        status: LoadingStatus.LOADED,
        data: options,
      },
    }),
  ),
  on(
    DeliveryDetailsActions.loadOptionsFailure,
    (state, { error }): DeliveryDetailsState => ({
      ...state,
      options: {
        ...state.options,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),
  on(DeliveryDetailsActions.resetOptions, (): DeliveryDetailsState => initialState),
  on(DeliveryDetailsActions.restoreState, (state, { restoredState }) => {
    const orders = Object.values(restoredState.entities).filter((order): order is Order => !!order);

    return adapter.setAll(orders, {
      ...state,
      activeOrderId: restoredState.activeOrderId,
    });
  }),

  // Order actions
  on(OrderActions.add, (state): DeliveryDetailsState => {
    const newOrder: Order = {
      id: uuidv4(),
      cargoType: null,
      documents: null,
      parcels: null,
      autoParts: null,
      otherCargo: null,
      packaging: null,
      additionalServices: null,
      validation: {},
    };

    const newState = adapter.addOne(newOrder, state);

    return {
      ...newState,
      activeOrderId: newOrder.id,
    };
  }),
  on(OrderActions.remove, (state, { orderId }): DeliveryDetailsState => {
    const newState = adapter.removeOne(orderId, state);
    const ids = adapter.getSelectors().selectIds(newState) as string[];

    return {
      ...newState,
      activeOrderId:
        state.activeOrderId === orderId
          ? ids.length
            ? ids[ids.length - 1]
            : null
          : state.activeOrderId,
    };
  }),
  on(
    OrderActions.setActive,
    (state, { orderId }): DeliveryDetailsState => ({
      ...state,
      activeOrderId: orderId,
    }),
  ),
  on(OrderActions.setCargoType, (state, { orderId, cargoType }): DeliveryDetailsState => {
    const order = state.entities[orderId];
    if (!order) return state;

    return adapter.updateOne(
      {
        id: orderId,
        changes: {
          cargoType,
          documents: cargoType === CargoType.DOCUMENTS ? order.documents : null,
          parcels: cargoType === CargoType.PARCELS ? order.parcels : null,
          autoParts: cargoType === CargoType.AUTO_PARTS ? order.autoParts : null,
          otherCargo: cargoType === CargoType.OTHER ? order.otherCargo : null,
        },
      },
      state,
    );
  }),
  on(OrderActions.updateData, (state, { orderId, data }): DeliveryDetailsState => {
    const order = state.entities[orderId];
    if (!order) return state;

    return adapter.updateOne(
      {
        id: orderId,
        changes: {
          ...data,
        },
      },
      state,
    );
  }),
  on(OrderActions.updateValidation, (state, { orderId, validation }): DeliveryDetailsState => {
    const order = state.entities[orderId];

    if (!order) return state;

    return adapter.updateOne(
      {
        id: orderId,
        changes: {
          validation: {
            ...order.validation,
            ...validation,
          },
        },
      },
      state,
    );
  }),
);
