import ModtreeLogo from '@/ui/svgs/logo'

export default function Loader(props: {
  pingSize: number
  logoSize: number
  logoTranslateY: number
}) {
  const ping = {
    height: props.pingSize,
    width: props.pingSize,
  }
  const logo = {
    height: props.logoSize,
    width: props.logoSize,
    transform: `translateY(${props.logoTranslateY}px)`,
  }
  return (
    <div className="w-20 h-20 flex justify-center items-center">
      <div style={ping}>
        <div className="h-full w-full border border-modtree-100 rounded-full animate-ping" />
      </div>
      <div className="absolute animate-bounce" style={logo}>
        <div className="animate-spin">
          <ModtreeLogo />
        </div>
      </div>
    </div>
  )
}

export function HomeLoader() {
  return (
    <div className="flex items-center justify-center">
      <Loader pingSize={50} logoSize={48} logoTranslateY={-1} />
    </div>
  )
}
