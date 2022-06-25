export default function Image({ src }) {
  return (
    <>
      <div className="w-full flex justify-center my-4">
        <img className="object-center" src={src} />
      </div>
    </>
  )
}
