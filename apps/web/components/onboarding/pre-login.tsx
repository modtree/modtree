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

export function PreLogin(props: { loggedIn: boolean }) {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [steps, setSteps] = useState<Step[]>([])

  function onExit() {
    setEnabled(false)
    localStorage.setItem('pre-login-tutorial', 'true')
  }

  useEffect(() => {
    /**
     * If done pre-login tutorial
     */
    if (localStorage.getItem('pre-login-tutorial') === 'true') {
      setEnabled(false)
    }
    if (!props.loggedIn) {
      /**
       * Onboarding for users not logged in
       */
      setSteps([
        {
          title: 'Welcome',
          intro: 'Welcome to <b>modtree</b>!',
        },
        {
          element: qs('root-search-bar'),
          title: 'Search bar',
          intro: 'Type in the box to search for a module',
        },
        {
          element: qs('top-right-button'),
          title: 'Sign in',
          intro: 'Sign in to learn more!',
        },
      ])
    }
  }, [])

  return (
    <Steps steps={steps} initialStep={0} onExit={onExit} enabled={enabled} />
  )
}
