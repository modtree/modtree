import { Step } from 'intro.js-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Steps = dynamic(() => import('intro.js-react').then((mod) => mod.Steps), {
  ssr: false,
})

/**
 * shorthand for document.querySelector
 */
function qs(selector: string) {
  return document.querySelector(`[data-onboarding="${selector}"]`)
}

function sel(selector: string) {
  return `[data-onboarding="${selector}"]`
}

export function PostLogin(props: { loggedIn: boolean }) {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [steps, setSteps] = useState<Step[]>([])

  const onBeforeChange = (nextStep: number, nextElement: any) => {
    if (nextStep === 1) {
      const userCircle = qs('modtree-user-circle')
      const btn = userCircle as HTMLElement
      btn.click()

      const stepsCopy = steps
      stepsCopy[1].element = qs('profile')
      setSteps([...stepsCopy])
      console.log(stepsCopy[1])
    }
  }

  function onExit() {
    setEnabled(false)
    //localStorage.setItem('post-login-tutorial', 'true')
  }

  useEffect(() => {
    /**
     * If done post-login tutorial
     */
    if (localStorage.getItem('post-login-tutorial') === 'true') {
      setEnabled(false)
    }
    if (props.loggedIn) {
      /**
       * Onboarding for users logged in
       */
      const topRightButton = qs('top-right-button')

      setSteps([
        {
          element: topRightButton,
          title: 'User menu',
          intro: 'This button contains the user menu.',
        },
        {
          element: qs('profile'),
          title: 'Your profile',
          intro: 'This leads to your profile',
        },
      ])
    }
  }, [])

  const options = {
    showStepNumbers: true,
    disableInteraction: false,
    showProgress: true,
  }

  return (
    <Steps
      steps={steps}
      initialStep={0}
      onExit={onExit}
      enabled={enabled}
      onBeforeChange={onBeforeChange}
      options={options}
      disableInteraction={false}
    />
  )
}
