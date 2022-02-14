import { ref, watchEffect } from 'vue'
import docs from './bal-popover.docs.mdx'
import { withContent } from '../../../stories/utils'
import { BalPopover, BalPopoverContent, BalButton } from '../../../../.storybook/vue/components'
import { BalComponentStory } from '../../../stories/utils/story'

const component = BalComponentStory({
  component: BalPopover,
  subcomponents: { BalPopoverContent },
  status: 'stable',
  argTypes: {
    ...withContent(),
  },
  docs,
})

export default component.story

export const Basic = args => ({
  components: { ...component.components, BalButton },
  setup: () => {
    const isActive = ref(true)

    const toggle = () => {
      isActive.value = !isActive.value
    }

    watchEffect(() => {
      isActive.value = args.value
    })

    return {
      args,
      isActive,
      toggle,
    }
  },
  template: `<bal-popover v-bind="args" v-model="isActive">
  <bal-button bal-popover-trigger @click="toggle()" aria-haspopup="true" color="is-info" outlined>
    Trigger
  </bal-button>
  <bal-popover-content :scrollable="200">
    <div class="p-3">
      <h5 class="title is-size-3" style="margin-top: 0px">Title</h5>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia nihil dolore nesciunt sed minus doloremque error quae excepturi molestiae molestias amet ab, explicabo
        dolor aperiam perferendis mollitia facilis harum vero. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia nihil dolore nesciunt sed minus doloremque
        error quae excepturi molestiae molestias amet ab, explicabo dolor aperiam perferendis mollitia facilis harum vero.
      </p>
    </div>
  </bal-popover-content>
  </bal-popover>`,
})
Basic.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
}
Basic.parameters = { ...component.sourceCode(Basic) }