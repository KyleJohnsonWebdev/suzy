/**
 * Shared loading state — branded animated lavender dots.
 * Replaces the three different plain "Loading..." nodes from V1.
 *
 * Fix: inline <style> tag removed. The loadingPulse keyframe
 * is already defined in index.css — the inline version was a
 * duplicate that contradicted the fix made to InstagramFlower.
 */
function LoadingScreen({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'max-w-6xl mx-auto px-6 py-20 flex items-center gap-3'

  return (
    <div className={wrapper}>
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full bg-lavender animate-loadingPulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingScreen
