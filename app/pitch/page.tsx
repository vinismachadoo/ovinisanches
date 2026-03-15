import Slides from "@/app/pitch/components/slides"
import * as React from "react"

const PitchPage = () => {
  return (
    <div className="h-full w-full p-10">
      <React.Suspense>
        <Slides />
      </React.Suspense>
    </div>
  )
}

export default PitchPage
