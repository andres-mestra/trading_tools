import { useDeviceInfo } from './useDeviceInfo'

export const useNotify = () => {
  const [deviceInfo] = useDeviceInfo()

  const onNotify = (message) => {
    if ('Notification' in window && !deviceInfo.isMovil) {
      new Notification('Notification', {
        body: message,
        dir: 'ltr',
      })
    }
  }

  const onActiveNotify = () => {
    if (!('Notification' in window) && !deviceInfo.isMovil)
      return alert('This browser does not support nitifications.')

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
