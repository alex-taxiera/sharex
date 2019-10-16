module.exports = {
  presets: [
    '@babel/env',
    '@babel/react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@loadable/babel-plugin',
    'inline-react-svg'
  ]
}
