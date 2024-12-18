const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
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
    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

export function deposit(amount, currency) {
  if (currency === "USD") {
    // Directly return the deposit action for USD
    return { type: "account/deposit", payload: amount };
  }

  // Handle currency conversion for non-USD currencies
  return async function (dispatch) {
    dispatch({ type: "account/convertingCurrency" });
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
      );

      if (!res.ok) throw new Error("Failed to fetch conversion rate.");

      const data = await res.json();
      const converted = data.rates.USD;

      // Dispatch the deposit action with the converted amount
      dispatch({ type: "account/deposit", payload: converted });
    } catch (error) {
      console.error("Error during currency conversion:", error.message);
    }
  };
}

export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

export function payLoan() {
  return {
    type: "account/payLoan",
  };
}
