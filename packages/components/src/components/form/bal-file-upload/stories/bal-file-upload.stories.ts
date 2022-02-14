import docs from './bal-file-upload.docs.mdx'
import { BalComponentStory } from '../../../../stories/utils'
import { BalFileUpload } from '../../../../../.storybook/vue/components'
import { balToastController } from '../../../../../dist/design-system-next-components/index.esm'

const component = BalComponentStory({
  title: 'Components/Form/FileUpload',
  component: BalFileUpload,
  status: 'stable',
  docs,
})

export default component.story

const Template = args => ({
  components: { ...component.components },
  setup: () => {
    const onBalRejectedFile = (event: any) => {
      if (event && event.detail) {
        balToastController.create({
          message: `${event.detail.file.name} => ${event.detail.reasons.join(', ')}`,
          duration: 2000,
          color: 'danger',
        })
      }
    }

    return {
      args,
      onBalRejectedFile,
    }
  },
  template: `<bal-field v-bind="args">
  <bal-field-label required>Upload Label</bal-field-label>
  <bal-field-control>
    <bal-file-upload @balRejectedFile="onBalRejectedFile($event)" v-bind="args"></bal-file-upload>
  </bal-field-control>
  <bal-field-message>Upload size per file is 20Mb.</bal-field-message>
  </bal-field>`,
})

export const Basic = Template.bind({})
Basic.args = {
  accept: 'image/png,image/jpeg',
  label: 'Choose or drop a file...',
  multiple: true,
  hasFileList: true,
  disabled: false,
  maxFiles: 3,
  maxFileSize: 1000000,
  maxBundleSize: 1000000,
}
Basic.parameters = { ...component.sourceCode(Basic), controls: { exclude: ['subTitle', 'value'] } }