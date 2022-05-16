import Head from 'next/head'

export const Container = (props: { children: any }) => {
  const padding = 'md:p-0 sm:p-8 p-6'

  const meta = {
    title: 'modtree',
  }
  // return <div className="mx-auto bg-gray-800 max-w-4xl flex flex-col">{props.children}</div>
  return (
    <div>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <main
        className={`contained flex flex-col justify-center max-w-2xl mx-auto ${padding}`}
      >
        {props.children}
        <div className="flex-1" />
      </main>
    </div>
  )
}
