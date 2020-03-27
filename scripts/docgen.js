const { promisify } = require('util')
const fs = require('fs')
const glob = promisify(require('glob'))

const coreFolder = 'packages/chakra-ui-core'
const listComponents = async () => {
  const files = await glob(`${coreFolder}/src/**/*.api.js`)
  return files
}

const convertToKebabCase = str => (
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-')
)

/**
 * Parses the component tags
 */
const parseTag = (component) => {
  const tag = {}
  if (component.props) {
    tag.attributes = Object.keys(component.props).map(propName => convertToKebabCase(propName))
  }
  tag.description = component.description || ''

  return tag
}

/**
 * Parses the component tags
 */
const parseAttributes = (componentTag, component) => {
  const props = {}
  Object.keys(component.props).forEach((originalPropName) => {
    const prop = component.props[originalPropName]
    const propName = convertToKebabCase(originalPropName)
    props[`${componentTag}/${propName}`] = prop
  })

  return props
}

const parseDocs = (components) => {
  const tags = {}
  let attributes = {}
  components.forEach((component) => {
    const componentTag = convertToKebabCase(component.name)
    tags[componentTag] = parseTag(component)
    if (component.props) {
      attributes = { ...parseAttributes(componentTag, component), ...attributes }
    }
  })

  return [tags, attributes]
}

const gen = async () => {
  const components = await listComponents()
  const componentsData = components.map((c) => require(`../${c}`).default)
  const [tags, attributes] = parseDocs(componentsData)

  if (!fs.existsSync(`${coreFolder}/vetur`)) {
    fs.mkdirSync(`${coreFolder}/vetur`)
  }

  fs.writeFileSync(`${coreFolder}/vetur/tags.json`, JSON.stringify(tags, null, 2), {

  })
  fs.writeFileSync(`${coreFolder}/vetur/attributes.json`, JSON.stringify(attributes, null, 2))
}

gen().then(() => {
  console.log('Vetur docs generated!')
})
