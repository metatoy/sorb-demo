/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ['../stories/**/*.stories.@(js|jsx)'],
  addons: ['@sorb/storybook'],
  framework: { name: '@storybook/react-vite', options: {} },
}

export default config
