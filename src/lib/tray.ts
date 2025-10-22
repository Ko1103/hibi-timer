import { invoke } from '@tauri-apps/api/core'

const COMMAND = 'set_tray_time'

export async function setTrayDisplay(text?: string) {
  try {
    if (typeof text === 'string') {
      await invoke(COMMAND, { text })
    } else {
      await invoke(COMMAND)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('failed to update tray display', error)
  }
}
