import { combineReducers, createStore } from "redux";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};
const initialStaCustomer = {
  fullname: "",
  nationalID: "",
  createdAt: "",
};

function customerReducer(state = initialStaCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullname: action.payLoad.fullname,
        nationalID: action.payLoad.nationalID,
        createdAt: action.payLoad.createdAt,
      };

    case "customer/updateName":
      return {
        ...state,
        fullname: action.payLoad.fullname,
      };

    default:
      return state;
  }
}
function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
const store = createStore(rootReducer);

function deposit(amount) {
  return { type: "account/deposit", payload: amount };
}

function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

function payLoan() {
  return {
    type: "account/payLoan",
  };
}

store.dispatch(deposit(500));
console.log(store.getState());

store.dispatch(withdraw(300));
console.log(store.getState());

store.dispatch(requestLoan(1000, "for my study"));
console.log(store.getState());

store.dispatch(payLoan());
console.log(store.getState());

function createCustomer(fullname, nationalID) {
  return {
    type: "customer/createCustomer",
    payLoad: { fullname, nationalID, createdAt: new Date().toISOString() },
  };
}
function updateName(fullname) {
  return {
    type: "customer/updateName",
    payLoad: { fullname },
  };
}
store.dispatch(createCustomer("Shahrukh Altaf", 23123290));
console.log(store.getState());
store.dispatch(updateName("hafiz Shahrukh Altaf"));
console.log(store.getState());
store.dispatch(deposit(500));
console.log(store.getState());
