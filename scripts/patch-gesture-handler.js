const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const target = path.join(
  projectRoot,
  'node_modules',
  'react-native-gesture-handler',
  'android',
  'src',
  'main',
  'java',
  'com',
  'swmansion',
  'gesturehandler',
  'react',
  'RNGestureHandlerModule.kt'
)

function applyPatch() {
  if (!fs.existsSync(target)) {
    console.log('[patch-gesture-handler] target file not found:', target)
    return
  }

  const src = fs.readFileSync(target, 'utf8')

  const unsafeCall = 'decorateRuntime(jsContext.get())'
  const safeCall = 'jsContext?.get()?.let { decorateRuntime(it) } ?: Log.w("[RNGestureHandler]", "JS context not available, skipping JSI bindings installation.")'

  if (src.includes(unsafeCall)) {
    const patched = src.replace(unsafeCall, safeCall)
    fs.writeFileSync(target, patched, 'utf8')
    console.log('[patch-gesture-handler] Replaced unsafe decorateRuntime call with nullable-safe call')
    return
  }

  if (src.includes(safeCall) || src.includes('JS context not available, skipping JSI bindings installation.')) {
    console.log('[patch-gesture-handler] Patch already applied')
    return
  }

  console.log('[patch-gesture-handler] Could not find expected snippet to patch; please inspect', target)
}

try {
  applyPatch()
} catch (e) {
  console.error('[patch-gesture-handler] Error applying patch:', e)
  process.exitCode = 1
}
