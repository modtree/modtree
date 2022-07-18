import { Step } from 'intro.js-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Steps = dynamic(() => import('intro.js-react').then((mod) => mod.Steps), {
  ssr: false,
})

export function Onboarding(props: { loggedIn: boolean }) {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [steps, setSteps] = useState<Step[]>([])

  const options = {
    disableInteraction: false,
  }

  useEffect(() => {
    /**
     * Onboarding for users not logged in
     */
    if (!props.loggedIn) {
      setSteps([
        {
          title: 'Welcome',
          intro: 'Welcome to <b>modtree</b>!',
        },
        {
          element: document.querySelector(
            '[data-onboarding="root-search-bar"]'
          ),
          title: 'Search bar',
          intro: 'Type in the box to search for a module',
        },
        {
          element: document.querySelector(
            '[data-onboarding="top-right-button"]'
          ),
          title: 'Sign in',
          intro: 'Sign in to learn more!',
        },
      ])
    }
  }, [])

  return (
    <Steps
      steps={steps}
      initialStep={0}
      onExit={() => setEnabled(false)}
      enabled={enabled}
      options={options}
    />
  )
}
