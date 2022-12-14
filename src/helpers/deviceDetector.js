import DeviceDetector from 'device-detector-js'

export function deviceDetector() {
  const userAgent = navigator?.userAgent
  const detector = new DeviceDetector()
  const deviceData = detector.parse(userAgent)
  return {
    deviceData,
    isMovil: deviceData?.device?.type === 'smartphone',
  }
}
