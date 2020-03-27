module.exports.default = {
  name: 'CButton',
  description: 'The Button component is an accessible rich component that does what a button does :)',
  props: {
    cast: {
      description: 'Sets the button color',
      type: 'string',
      options: ['primary', 'secondary', 'success', 'warning', 'danger']
    },
    iconSpacing: {
      description: 'Adds spacing around the icon',
      type: 'string|number'
    }
  }
}
