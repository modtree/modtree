import { hideModuleStateGuide } from '@/store/modal'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { CloseButton } from '@/ui/buttons'
import { flatten } from '@/utils/tailwind'

export function FloatingActionButton() {
  const show = useAppSelector((s) => s.modal.showModuleStateGuide)
  const dispatch = useAppDispatch()
  return show ? (
    <div className="absolute right-10 bottom-10 select-none">
      <div className="flex flex-row">
        <div
          className={flatten('px-4 py-3', 'bg-white rounded-lg', 'shadow-xl')}
        >
          <h5 className="flex flex-row h-6 items-center">
            <span className="flex-1 mb-0">Module state guide</span>
            <div>
              <CloseButton close={() => dispatch(hideModuleStateGuide())} />
            </div>
          </h5>
          <li className="list-inside marker:text-green-500">Done</li>
          <li className="list-inside marker:text-black">Currently doing</li>
          <li className="list-inside marker:text-gray-500">Planned</li>
          <li className="list-inside marker:text-red-500">
            Pre-requisites not fulfilled
          </li>
        </div>
      </div>
    </div>
  ) : null
}
