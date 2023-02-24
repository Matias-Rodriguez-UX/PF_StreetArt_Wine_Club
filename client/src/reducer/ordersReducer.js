import { GET_ORDERS } from "../actions/allActions";

const initialState = {
  orders: [],
  allOrders: [],
};

export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        allOrders: action.payload,
      };
    default:
      return { ...state };
  }
}
