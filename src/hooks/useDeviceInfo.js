import { useMemo } from 'react'
import { deviceDetector } from '../helpers/deviceDetector'

export const useDeviceInfo = () => {
  const deviceInfo = useMemo(() => deviceDetector(), [])

  return [deviceInfo]
}
