import { invoke } from '@tauri-apps/api/core'

const COMMAND = 'set_tray_title'

export async function setTrayTitle(title: string | null) {
  await invoke(COMMAND, { title: title || '--:--' })
}
