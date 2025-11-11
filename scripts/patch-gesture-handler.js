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

  const unsafeSnippet = /val jsContext = reactApplicationContext\.javaScriptContextHolder\s*[\r\n]+\s*decorateRuntime\(jsContext\.get\(\)\)/m
  const safeSnippet = `val jsContext = reactApplicationContext.javaScriptContextHolder\n      // javaScriptContextHolder is nullable on some RN versions/configurations.\n      // Use a safe call and only call native decorateRuntime when we have a non-null pointer.\n      val jsiPtr = jsContext?.get()\n      if (jsiPtr != null) {\n        decorateRuntime(jsiPtr)\n        true\n      } else {\n        // If no JS context is available, skip JSI bindings installation.\n        Log.w("[RNGestureHandler]", "JS context not available, skipping JSI bindings installation.")\n        false\n      }`

  if (unsafeSnippet.test(src)) {
    const patched = src.replace(unsafeSnippet, safeSnippet)
    fs.writeFileSync(target, patched, 'utf8')
    console.log('[patch-gesture-handler] Applied safe-call patch to RNGestureHandlerModule.kt')
  } else if (src.includes('JS context not available, skipping JSI bindings installation.')) {
    console.log('[patch-gesture-handler] Patch already applied (marker found)')
  } else {
    // More tolerant replacement in case file differs slightly
    const fallbackOld = 'val jsContext = reactApplicationContext.javaScriptContextHolder'
    if (src.includes(fallbackOld) && !src.includes('decorateRuntime(jsContext.get())')) {
      console.log('[patch-gesture-handler] Looks like file already changed; no action taken')
      return
    }
    if (src.includes(fallbackOld)) {
      const replaced = src.replace(fallbackOld, `val jsContext = reactApplicationContext.javaScriptContextHolder\n      // javaScriptContextHolder is nullable on some RN versions/configurations.\n      // Use a safe call and only call native decorateRuntime when we have a non-null pointer.\n      val jsiPtr = jsContext?.get()\n      if (jsiPtr != null) {\n        decorateRuntime(jsiPtr)\n        true\n      } else {\n        // If no JS context is available, skip JSI bindings installation.\n        Log.w("[RNGestureHandler]", "JS context not available, skipping JSI bindings installation.")\n        false\n      }`)
      if (replaced !== src) {
        fs.writeFileSync(target, replaced, 'utf8')
        console.log('[patch-gesture-handler] Applied fallback safe-call patch')
      }
    } else {
      console.log('[patch-gesture-handler] Could not find expected snippet to patch; please inspect', target)
    }
  }
}

try {
  applyPatch()
} catch (e) {
  console.error('[patch-gesture-handler] Error applying patch:', e)
  process.exitCode = 1
}
