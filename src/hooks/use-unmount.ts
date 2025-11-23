import { useRef, useEffect } from "react"

/**
 * Hook that returns the latest value of a callback
 */
function useLatest<T>(value: T) {
  const ref = useRef(value)
  
  useEffect(() => {
    ref.current = value
  })
  
  return ref
}

/**
 * Hook that executes a callback when the component unmounts.
 *
 * @param callback Function to be called on component unmount
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUnmount = (callback: (...args: Array<any>) => any) => {
  const latestCallback = useLatest(callback)

  useEffect(
    () => () => {
      latestCallback.current()
    },
    [latestCallback] // This dependency is stable
  )
}

export default useUnmount