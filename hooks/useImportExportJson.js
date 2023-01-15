import { useRef } from 'react'

export function useImportExportJson() {
  const refInputImport = useRef(null)

  const exportToJsonFile = (data) => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = 'points.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importJsonFile = (event, callback) => {
    if (event.target.files?.length) {
      const file = event.target.files[0]

      const fileReader = new FileReader()
      fileReader.readAsText(file, 'UTF-8')
      fileReader.onload = ({ target }) => {
        const listElement = JSON.parse(`${target.result}`)
        callback(listElement)
        refInputImport.current.value = null
      }
    }
  }

  return [importJsonFile, exportToJsonFile, refInputImport]
}
