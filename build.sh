npx expo export --platform web
find dist -type f -name "*.js" -exec sed -i '' 's/node_modules/modules/g' {} +
mv dist/assets/node_modules dist/assets/modules
