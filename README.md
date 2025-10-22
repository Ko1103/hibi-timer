# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

```shell
npm run tauri build -- --no-bundle
# bundle for distribution outside the macOS App Store
npm run tauri bundle -- --bundles app,dmg

# build for windows
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc
```

```shell
export APPLE_API_ISSUER=9886BK756P
export APPLE_API_KEY=74TRB268BB
export APPLE_API_KEY_PATH='xxx'
```
