'use client'

import { useReducer } from 'react'

// Define actions without exporting them
const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
} as const;

// TypeScript state and action types for better type safety
interface CalculatorState {
  overwrite?: boolean;
  currentOperand?: string | null;
  previousOperand?: string | null;
  operation?: string | null;
}

type CalculatorAction = 
  | { type: typeof ACTIONS.ADD_DIGIT; payload: { digit: string } }
  | { type: typeof ACTIONS.CHOOSE_OPERATION; payload: { operation: string } }
  | { type: typeof ACTIONS.CLEAR }
  | { type: typeof ACTIONS.DELETE_DIGIT }
  | { type: typeof ACTIONS.EVALUATE };

function reducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        }
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") return state
      if (action.payload.digit === "." && state.currentOperand?.includes(".")) return state

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        }
      }
      
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }

    default:
      return state
  }
}

function evaluate({ currentOperand, previousOperand, operation }: CalculatorState): string {
  if (!currentOperand || !previousOperand || !operation) return "";
  
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  
  if (isNaN(prev) || isNaN(current)) return ""
  
  let computation = 0
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
      return ""
  }
  
  return computation.toString()
}

interface DigitButtonProps {
  dispatch: React.Dispatch<CalculatorAction>;
  digit: string;
}

function DigitButton({ dispatch, digit }: DigitButtonProps) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
      className="text-2xl border border-gray-300 hover:bg-gray-100"
    >
      {digit}
    </button>
  )
}

interface OperationButtonProps {
  dispatch: React.Dispatch<CalculatorAction>;
  operation: string;
}

function OperationButton({ dispatch, operation }: OperationButtonProps) {
  return (
    <button
      onClick={() => dispatch({ 
        type: ACTIONS.CHOOSE_OPERATION, 
        payload: { operation } 
      })}
      className="text-2xl border border-gray-300 hover:bg-gray-100 text-[#D495E5]"
    >
      {operation}
    </button>
  )
}

export default function Home() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <main className="h-[700px] flex items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-4 grid-rows-[minmax(120px,_auto)_repeat(5,_80px)] gap-2 w-[340px] bg-white shadow-lg rounded-lg p-2">
        <div className="col-span-4 bg-gray-200 p-4 rounded text-right">
          <div className="text-gray-500 text-lg">
            {previousOperand} {operation}
          </div>
          <div className="text-3xl font-bold text-black break-words min-h-[60px]">
            {currentOperand}
          </div>
        </div>

        <button
          className="col-span-2 text-2xl border border-gray-300 hover:bg-gray-100"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          className="text-2xl border border-gray-300 hover:bg-gray-100"
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="col-span-2 text-2xl border border-gray-300 hover:bg-gray-100 bg-[#D495E5] text-white"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </main>
  )
}