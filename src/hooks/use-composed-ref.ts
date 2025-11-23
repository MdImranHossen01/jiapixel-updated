"use client"

import { useCallback, useRef } from "react"

// basically Exclude<React.ClassAttributes<T>["ref"], string>
type UserRef<T> =
  | ((instance: T | null) => void)
  | React.RefObject<T | null>
  | null
  | undefined

const updateRef = <T>(ref: NonNullable<UserRef<T>>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && typeof ref === "object" && "current" in ref) {
    // Use type assertion to safely assign to ref
    const mutableRef = ref as React.MutableRefObject<T | null>
    mutableRef.current = value
  }
}

export const useComposedRef = <T extends HTMLElement>(
  libRef: React.RefObject<T | null>,
  userRef: UserRef<T>
) => {
  const prevUserRef = useRef<UserRef<T>>(null)

  return useCallback(
    (instance: T | null) => {
      // Create a local copy that we can modify
      const libRefCopy = libRef
      
      if (libRefCopy && "current" in libRefCopy) {
        const mutableRef = libRefCopy as React.MutableRefObject<T | null>
        mutableRef.current = instance
      }

      if (prevUserRef.current) {
        updateRef(prevUserRef.current, null)
      }

      prevUserRef.current = userRef

      if (userRef) {
        updateRef(userRef, instance)
      }
    },
    [libRef, userRef]
  )
}

export default useComposedRef