const numberRegex = /_number$/

export default function extractFromDOM(args) {
  // If being passed an event with DOM element that has a dataset
  if (args[0] && args[0].target && args[0].target.dataset) {
    const event = args[0]
    const { target } = event
    let values = {
      value: target.value,
      checked: target.checked,
      name: target.name
    }

    const { dataset } = target
    const dataKeys = Object.keys(dataset)
    // If submitting a form and data-extract is present on the <form>
    if (event.type === 'submit' && dataset.extract) {
      event.preventDefault()

      const reset = !!dataset.reset // data-reset
      const { elements } = event.target
      // Loop through form elements https://stackoverflow.com/a/19978872
      for (let i = 0, element; element = elements[i++];) {
          // Read value from <input>
          values[element.name] = element.value
          if (reset) {
            // Reset <input> value
            element.value = ''
          }
      }
    }
    // Read values from data- attributes
    else {
      dataKeys.forEach(dataKey => {
        let value
        if (numberRegex.test(dataKey)) {
          // Read and convert value
          value = parseFloat(dataset[dataKey])
          // Strip off _number suffix from final key
          dataKey = dataKey.replace(numberRegex, '')
        }
        else {
          // Use string value
          value = dataset[dataKey]
        }
        
        values[dataKey] = value
      })
    }

    // Place extracted dataset values first, followed by original arguments
    args = [values].concat(args)
  }

  return args
}