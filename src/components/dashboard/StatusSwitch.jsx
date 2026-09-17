"use client"

/**
 * A small pill toggle. `name` (optional) also renders a hidden input so this
 * can double as a controlled form field inside a native `<form action={...}>`.
 * @param {{ checked: boolean, onChange: (next: boolean) => void, disabled?: boolean, name?: string }} props
 */
export default function StatusSwitch({ checked, onChange, disabled, name }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
      {name && <input type="hidden" name={name} value={checked ? "true" : "false"} />}
    </button>
  )
}
