/* 
  Hack to prevent flashing a black frame at the end
  of looping videos by stripping a few frames at the end
  of the video before resetting the current time.
*/

export default function init(videoElements) {
  videoElements.forEach(video => {
    video.onloadedmetadata = function() {
      this.currentTime = this.duration / 2
    }

    video.play()

    video.addEventListener('timeupdate', function() {
      if (this.currentTime >= this.duration - 0.1) {
        this.currentTime = 0
      }
    })
  })
}
