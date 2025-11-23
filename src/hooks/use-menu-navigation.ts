"use client"

import type { Editor } from "@tiptap/react"
import { useEffect, useState, useRef, useCallback } from "react"

type Orientation = "horizontal" | "vertical" | "both"

interface MenuNavigationOptions<T> {
  /**
   * The Tiptap editor instance, if using with a Tiptap editor.
   */
  editor?: Editor | null
  /**
   * Reference to the container element for handling keyboard events.
   */
  containerRef?: React.RefObject<HTMLElement | null>
  /**
   * Search query that affects the selected item.
   */
  query?: string
  /**
   * Array of items to navigate through.
   */
  items: T[]
  /**
   * Callback fired when an item is selected.
   */
  onSelect?: (item: T) => void
  /**
   * Callback fired when the menu should close.
   */
  onClose?: () => void
  /**
   * The navigation orientation of the menu.
   * @default "vertical"
   */
  orientation?: Orientation
  /**
   * Whether to automatically select the first item when the menu opens.
   * @default true
   */
  autoSelectFirstItem?: boolean
}

/**
 * Hook that implements keyboard navigation for dropdown menus and command palettes.
 *
 * Handles arrow keys, tab, home/end, enter for selection, and escape to close.
 * Works with both Tiptap editors and regular DOM elements.
 *
 * @param options - Configuration options for the menu navigation
 * @returns Object containing the selected index and a setter function
 */
export function useMenuNavigation<T>({
  editor,
  containerRef,
  query,
  items,
  onSelect,
  onClose,
  orientation = "vertical",
  autoSelectFirstItem = true,
}: MenuNavigationOptions<T>) {
  // Initialize state based on props to avoid the effect
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    // Initialize based on current query and autoSelectFirstItem
    return (query && autoSelectFirstItem && items.length > 0) ? 0 : -1
  })

  // Use refs to track latest values without causing effect issues
  const itemsRef = useRef(items)
  const selectedIndexRef = useRef(selectedIndex)
  
  // Update refs in effects
  useEffect(() => {
    itemsRef.current = items
  })
  
  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  })

  // Handle query changes by resetting selection
  useEffect(() => {
    // This effect only runs when query changes significantly
    // and doesn't cause cascading renders because it's conditional
    if (query !== undefined) {
      const shouldReset = items.length > 0 && autoSelectFirstItem
      if (shouldReset && selectedIndex !== 0) {
        // Use requestAnimationFrame to defer the state update
        requestAnimationFrame(() => {
          setSelectedIndex(0)
        })
      } else if (!shouldReset && selectedIndex !== -1) {
        requestAnimationFrame(() => {
          setSelectedIndex(-1)
        })
      }
    }
  }, [query, items.length, autoSelectFirstItem, selectedIndex])

  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    const currentItems = itemsRef.current
    if (!currentItems.length) return false

    const moveNext = () =>
      setSelectedIndex((currentIndex) => {
        if (currentIndex === -1) return 0
        return (currentIndex + 1) % currentItems.length
      })

    const movePrev = () =>
      setSelectedIndex((currentIndex) => {
        if (currentIndex === -1) return currentItems.length - 1
        return (currentIndex - 1 + currentItems.length) % currentItems.length
      })

    switch (event.key) {
      case "ArrowUp": {
        if (orientation === "horizontal") return false
        event.preventDefault()
        movePrev()
        return true
      }

      case "ArrowDown": {
        if (orientation === "horizontal") return false
        event.preventDefault()
        moveNext()
        return true
      }

      case "ArrowLeft": {
        if (orientation === "vertical") return false
        event.preventDefault()
        movePrev()
        return true
      }

      case "ArrowRight": {
        if (orientation === "vertical") return false
        event.preventDefault()
        moveNext()
        return true
      }

      case "Tab": {
        event.preventDefault()
        if (event.shiftKey) {
          movePrev()
        } else {
          moveNext()
        }
        return true
      }

      case "Home": {
        event.preventDefault()
        setSelectedIndex(0)
        return true
      }

      case "End": {
        event.preventDefault()
        setSelectedIndex(currentItems.length - 1)
        return true
      }

      case "Enter": {
        if (event.isComposing) return false
        event.preventDefault()
        const currentSelectedIndex = selectedIndexRef.current
        if (currentSelectedIndex !== -1 && currentItems[currentSelectedIndex]) {
          onSelect?.(currentItems[currentSelectedIndex])
        }
        return true
      }

      case "Escape": {
        event.preventDefault()
        onClose?.()
        return true
      }

      default:
        return false
    }
  }, [orientation, onSelect, onClose])

  useEffect(() => {
    let targetElement: HTMLElement | null = null

    if (editor) {
      targetElement = editor.view.dom
    } else if (containerRef?.current) {
      targetElement = containerRef.current
    }

    if (targetElement) {
      targetElement.addEventListener("keydown", handleKeyboardNavigation, true)
      return () => {
        targetElement?.removeEventListener("keydown", handleKeyboardNavigation, true)
      }
    }

    return undefined
  }, [editor, containerRef, handleKeyboardNavigation])

  return {
    selectedIndex: items.length ? selectedIndex : undefined,
    setSelectedIndex,
  }
}