/*
  Prevent a black frame flash at the end of looping videos by seeking back
  just before the native loop wraps. We use requestVideoFrameCallback when
  available (frame-accurate) and fall back to requestAnimationFrame. The
  margin is kept tight so the skip is imperceptible on videos designed to
  loop seamlessly.
*/

const LOOP_SAFETY_MARGIN = 0.05 // seconds before the end where we seek back

export default function init(videoElements) {
  videoElements.forEach((video) => {
    const jumpToMidpoint = () => {
      video.currentTime = video.duration / 2
    }

    if (video.readyState >= 1 /* HAVE_METADATA */) {
      jumpToMidpoint()
    } else {
      video.addEventListener('loadedmetadata', jumpToMidpoint, { once: true })
    }

    video.play()

    const check = () => {
      if (video.duration && video.currentTime >= video.duration - LOOP_SAFETY_MARGIN) {
        video.currentTime = 0
      }
    }

    if ('requestVideoFrameCallback' in video) {
      const onFrame = () => {
        if (!video.isConnected) return
        check()
        video.requestVideoFrameCallback(onFrame)
      }
      video.requestVideoFrameCallback(onFrame)
    } else {
      const tick = () => {
        if (!video.isConnected) return
        check()
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  })
}
