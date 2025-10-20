const fs = require('fs');
const path = require('path');
const dest = path.join(__dirname, '..', 'node_modules', 'expo-modules-autolinking', 'android', 'expo-gradle-plugin');
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'build.gradle'), '// placeholder build.gradle');
  fs.writeFileSync(path.join(dest, 'settings.gradle'), 'rootProject.name = "expo-gradle-plugin-placeholder"');
  console.log('Created expo-gradle-plugin placeholder');
} else {
  console.log('expo-gradle-plugin already exists');
}

