import { flatten } from '@/utils/tailwind'
import { useState } from 'react'
import { IoReceiptOutline } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

export function FloatingActionButton() {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="absolute right-10 bottom-10 select-none">
      <div className="flex flex-row">
        <div className="flex flex-col justify-center">
          {showTooltip ? (
            <div className="text-white bg-gray-400 px-2 py-0.5 rounded-md mr-4 shadow-md">
              Degree Builder
            </div>
          ) : null}
        </div>
        <button
          className={flatten(
            'flex centered w-12 h-12',
            'bg-white rounded-full',
            'hover:bg-gray-50 active:bg-gray-200 shadow-xl'
          )}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseDown={() => setShowTooltip(false)}
          // TODO: re-enable this button after fixing search
          // onClick={() => dispatch(showBuilder())}
        >
          <IoReceiptOutline color={colors.gray[800]} size={22} />
        </button>
      </div>
    </div>
  )
}
