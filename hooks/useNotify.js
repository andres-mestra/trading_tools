import { isMobile } from 'react-device-detect'

export const useNotify = () => {
  const onNotify = (message) => {
    if (!isMobile) {
      new Notification('Notification', {
        body: message,
        dir: 'ltr',
      })
    }
  }

  const onActiveNotify = () => {
    if (isMobile) return alert('This browser does not support nitifications.')

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        onNotify('Notificaciones activadas')
      }
    })
  }

  return {
    onNotify,
    onActiveNotify,
  }
}
