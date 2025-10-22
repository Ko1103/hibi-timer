import { invoke } from '@tauri-apps/api/core'

const COMMAND = 'show_window'

export async function showWindow() {
  await invoke(COMMAND)
}
