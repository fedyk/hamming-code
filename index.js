"use strict";
//  JavaScript program to demonstrate hamming code

/*
 * Use the formula 2 ^ r >= m + r + 1
 * to calculate the no of redundant bits.
 * Iterate over 0 .. m and return the value
 * that satisfies the equation
 */
function calcRedundantBits(m) {
  for (let i = 0; i < m; i++)
    if (2 ** i >= m + i + 1) {
      return i
    }
}

function posRedundantBits(data, r) {
  // Redundancy bits are placed at the positions
  // which correspond to the power of 2.
  const m = len(data)
  let j = 0
  let k = 1
  let res = ""

  // If position is power of 2 then insert "0"
  // Else append the data
  for (let i = 1; i < m + r + 1; i++)
    if (i === 2 ** j) {
      res = res + "0"
      j += 1
    }
    else {
      res = res + data.at(-1 * k)
      k += 1
    }

  // The result is reversed since positions are
  // counted backwards. (m + r+1 ... 1)
  return res.split("").reverse().join("");
}

/**
 * 
 * @param arr {string}
 * @param r 
 * @returns 
 */
function calcParityBits(arr, r) {
  let n = len(arr)

  // For finding rth parity bit, iterate over
  // 0 to r - 1
  for (let i = 0; i < r; i++) {
    let val = 0

    for (let j = 1; j < n + 1; j++) {
      // If position has 1 in ith significant
      // position then Bitwise OR the array value
      // to find parity bit value.
      if ((j & (2 ** i)) === (2 ** i)) {
        val = val ^ Number(arr.at(-1 * j))
        // -1 * j is given since array is reversed
      }
    }

    // String Concatenation
    // (0 to n - 2^r) + parity bit + (n - 2^r + 1 to n)
    arr = arr.substring(0, n - (2 ** i)) + String(val) + arr.substring(n - (2 ** i) + 1)
  }

  return arr
}


function detectError(arr, nr) {
  let n = len(arr)
  let res = 0

  // Calculate parity bits again
  for (let i = 0; i < nr; i++) {
    let val = 0

    for (let j = 1; j < n + 1; j++) {
      if ((j & (2 ** i)) === (2 ** i)) {
        val = val ^ Number(arr.at(-1 * j))
      }
    }

    // Create a binary no by appending
    // parity bits together.
    res = res + val * (10 ** i)
  }

  //  Convert binary to decimal
  return parseInt(String(res), 2)
}

function len(data) {
  return data.length
}

// Enter the data to be transmitted
const data = "1011001"

// Calculate the no of Redundant Bits Required
const m = len(data)
const r = calcRedundantBits(m)

// Determine the positions of Redundant Bits
let arr = posRedundantBits(data, r)

// Determine the parity bits
arr = calcParityBits(arr, r)

// Data to be transferred
console.log("Data transferred is " + arr)

// Stimulate error in transmission by changing
// a bit value.
// 10101001110 -> 11101001110, error in 10th position.

arr = "11101001110"
console.log("Error Data is " + arr)
const correction = detectError(arr, r)

if (correction == 0)
  console.log("There is no error in the received message.")
else
  console.log("The position of error is ", len(arr) - correction + 1, "from the left")
