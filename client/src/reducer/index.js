import {
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS,
  GET_FILTER_PRODUCTS,
  ORDER_BY_PRICE,
  ORDER_A_TO_Z,
  GET_PRODUCT_BY_NAME,
  LOADING_ACTION,
  GET_TYPES,
  GET_REGIONS,
  GET_STATES,
  GET_GRAPES,
 // REVIEW_PRODUCT,
  //GET_REVIEWS,
} from "../actions/allActions";

const initialState = {
  wineDetail: [],
  products: [],
  allProducts: [],
  filtersActive: false,
  showLoading: false,
  types: [],
  regions: [],
  states: [],
  grapes: [],
 
};

function sortArrayAtoZ(x, y) {
  if (x.name < y.name) {
    return -1;
  }
  if (x.name > y.name) {
    return 1;
  }
  return 0;
}
function sortArrayZtoA(x, y) {
  if (x.name > y.name) {
    return -1;
  }
  if (x.name < y.name) {
    return 1;
  }
  return 0;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_ACTION:
      return {
        ...state,
        showLoading: action.payload
      }
    case GET_PRODUCT_BY_ID:
      return {
        ...state,
        wineDetail: action.payload,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        allProducts: action.payload,
        products: action.payload,
      };

    case GET_FILTER_PRODUCTS:
      const names = action.payload;
      const matchingWines = state.allProducts.filter((wines) =>
        names.includes(wines.name)
      );
      return {
        ...state,
        products: matchingWines,
      };
    case ORDER_A_TO_Z:
      const productsByName =
        action.payload === "a"
          ? state.products.sort(sortArrayAtoZ)
          : state.products.sort(sortArrayZtoA);
      return {
        ...state,
        products: productsByName,
      };
    case ORDER_BY_PRICE:
      const productsByPrice =
        action.payload === "high"
          ? state.products.sort((b, a) => a.price - b.price)
          : state.products.sort((b, a) => b.price - a.price);
      return {
        ...state,
        products: productsByPrice,
      };

    case GET_PRODUCT_BY_NAME:
      return {
        ...state,
        products:
          action.payload === ""
            ? state.allProducts
            : state.allProducts.filter((el) =>
              el.name
                .split(" ")
                .some((el) => el.includes(action.payload.split(" ")[0]))
            ),
      };
    case GET_TYPES:
      return {
        ...state,
        types: action.payload
      }
    case GET_REGIONS:
      return {
        ...state,
        regions: action.payload
      }
    case GET_STATES:
      return {
        ...state,
        states: action.payload
      }
    case GET_GRAPES:
      return {
        ...state,
        grapes: action.payload
      }
      // case REVIEW_PRODUCT:
      //   return{
      //     ...state
      //   }
      // case GET_REVIEWS:
      //   return{
      //     ...state,
      //     getReviews: action.payload
      //   }  
   
    default:
      return state; //!
  }
}
