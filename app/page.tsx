'use client'

import { useReducer } from 'react'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand?.includes(".")) return state

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
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

function evaluate({ currentOperand, previousOperand, operation }: any) {
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

function DigitButton({ dispatch, digit }: any) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
      className="text-2xl border border-gray-300 hover:bg-gray-100"
    >
      {digit}
    </button>
  )
}

function OperationButton({ dispatch, operation }: any) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}
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
          <div className="text-3xl font-bold text-black">{currentOperand}</div>
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
