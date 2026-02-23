import React, { useEffect, useRef, useState } from 'react'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '=',]
]

const isOperator = (ch) => ['+', '-', '×', '÷', '*', '/'].includes(ch)

function sanitizeExpression(expr) {
  // 許可する文字のみ残す（安全性向上のため）
  return expr.replace(/[^0-9.+\-*/()%]/g, '')
}

function evaluateExpression(input) {
  if (!input) return ''
  let expr = input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')

  // パーセント処理: 50% -> (50/100)
  expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
  expr = sanitizeExpression(expr)

  try {
    if (/[^0-9.+\-*/() ]/.test(expr)) throw new Error('Invalid characters')
    // eslint-disable-next-line no-new-func
    const res = Function("'use strict'; return (" + expr + ")")()
    if (res === Infinity || Number.isNaN(res)) return 'Error'
    // 不要な小数点を取り除く
    return Number.isFinite(res) ? String(res) : 'Error'
  } catch (e) {
    return 'Error'
  }
}

export default function App() {
  const [display, setDisplay] = useState('0')
  const [lastResult, setLastResult] = useState(null)
  // 計算直後に次の数値入力で置換するためのフラグ
  const [justComputed, setJustComputed] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      const key = e.key
      if ((key >= '0' && key <= '9') || key === '.') {
        handleInput(key)
      } else if (key === '+') handleInput('+')
      else if (key === '-') handleInput('-')
      else if (key === '*' || key === 'x' || key === 'X') handleInput('×')
      else if (key === '/') handleInput('÷')
      else if (key === 'Enter' || key === '=') compute()
      else if (key === 'Backspace') onClearBack()
      else if (key === 'Escape') clearAll()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [display, justComputed])

  function setDisplaySafe(next) {
    setDisplay(next === '' ? '0' : next)
  }

  // 現在の直近の数値セグメントを取り出す
  function currentNumberSegment(str) {
    const match = str.match(/(-?\d*\.?\d+)$/)
    return match ? match[0] : ''
  }

  function handleInput(token) {
    // デバッグログ: どの入力が来ているかを常に出力
    console.debug('[INPUT] token=', token, 'displayBefore=', display, 'justComputed=', justComputed)

    // 数字入力
    if (/\d/.test(token)) {
      console.debug('[INPUT] numeric branch (displayBefore)=', display)
      // 計算直後の数字入力は表示を置換する
      if (justComputed) {
        setDisplaySafe(token)
        setJustComputed(false)
        return
      }
      if (display === '0') setDisplaySafe(token)
      else setDisplaySafe(display + token)
      return
    }

    if (token === '.') {
      const seg = currentNumberSegment(display)
      console.debug('[INPUT] dot branch seg=', seg)
      // 計算直後の '.' は '0.' を開始
      if (justComputed) {
        setDisplaySafe('0.')
        setJustComputed(false)
        return
      }
      if (seg.includes('.')) return // 既に小数点がある
      setDisplaySafe(display + '.')
      return
    }

    // 演算子入力
    if (isOperator(token)) {
      console.debug('[INPUT] operator branch token=', token)
      // 表示が 'Error' の場合はリセット
      if (display === 'Error') return
      // 計算直後に演算子が来た場合は計算結果を利用して続ける
      if (justComputed) {
        setJustComputed(false)
      }
      // 末尾が演算子なら上書き
      if (display.length === 0) return
      if (isOperator(display.slice(-1))) {
        setDisplaySafe(display.slice(0, -1) + token)
      } else {
        setDisplaySafe(display + token)
      }
      return
    }

    // パーセントは直前の数に追加
    if (token === '%') {
      console.debug('[INPUT] percent branch')
      // 末尾が数字なら追加
      if (/\d$/.test(display)) {
        setDisplaySafe(display + '%')
        setJustComputed(false)
      }
      return
    }
  }

  function onButtonClick(value) {
    if (value === 'C') return clearAll()
    if (value === '±') return toggleSign()
    if (value === '%') return handleInput('%')
    if (value === '=') return compute()
    handleInput(value)
  }

  function clearAll() {
    setDisplaySafe('0')
    setLastResult(null)
    setJustComputed(false)
  }

  function onClearBack() {
    if (display === 'Error') {
      setDisplaySafe('0')
      setJustComputed(false)
      return
    }
    if (display.length <= 1) setDisplaySafe('0')
    else setDisplaySafe(display.slice(0, -1))
    setJustComputed(false)
  }

  function toggleSign() {
    // 最後の数値セグメントに対して符号を反転
    const seg = currentNumberSegment(display)
    if (!seg) return
    const start = display.lastIndexOf(seg)
    const before = display.slice(0, start)
    const toggled = seg.startsWith('-') ? seg.slice(1) : '-' + seg
    setDisplaySafe(before + toggled)
  }

  function compute() {
    if (display === 'Error') return
    const res = evaluateExpression(display)
    console.debug('[CALC] compute ->', res)
    setLastResult(res)
    setDisplaySafe(res)
    // 計算直後フラグを立てる
    setJustComputed(true)
  }

  // デバッグ: 入力時の状態を確認する
  function debugHandleInput(token) {
    console.debug('[INPUT] token=', token, 'displayBefore=', display)
    handleInput(token)
  }

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-4" role="application" aria-label="電卓">
        <div className="mb-4 px-3">
          <div className="text-right text-sm text-gray-500 h-5" aria-live="polite">{lastResult !== null && lastResult !== 'Error' ? `=${lastResult}` : ''}</div>
          <div className="bg-gray-100 rounded-md p-3 text-right text-2xl font-medium break-words" role="textbox" aria-label="Calculator display" tabIndex={0}>{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Calculator buttons">
          {BUTTONS.flat().map((b, i) => {
            const isZero = b === '0'
            const isAction = ['÷','×','-','+','=','%','C','±'].includes(b)
            return (
              <button
                key={i}
                onClick={() => onButtonClick(b)}
                className={`py-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${isZero ? 'col-span-2 text-left pl-6' : ''} ${isAction ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                aria-label={`Button ${b}`}>
                {b}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
