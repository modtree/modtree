import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

export default function FloatingActionButton() {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="absolute right-10 bottom-10 z-10 select-none">
      <div className="flex flex-row">
        <div className="flex flex-col justify-center">
          {showTooltip ? (
            <div className="text-white bg-gray-400 px-2 py-0.5 rounded-md mr-4 shadow-md">
              Degree Builder
            </div>
          ) : null}
        </div>
        <div
          className="flex justify-center items-center w-12 h-12 bg-white rounded-full hover:bg-gray-50 active:bg-gray-200 cursor-pointer shadow-xl"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseDown={() => setShowTooltip(false)}
        >
          <IoSettingsOutline color={colors.gray[800]} size={22} />
        </div>
      </div>
    </div>
  )
}
