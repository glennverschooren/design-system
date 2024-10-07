import React from 'react'
import ReactDOMServer from 'react-dom/server'
import type { ReactWebComponent } from '@lit/react'
import { Writable } from 'stream'

import { possibleStandardNames } from './constants'
import { CreateComponentForServerSideRenderingOptions, EventNames, StencilProps } from './types'
import { camelToDashCase, isPrimitive } from './utils'

/**
 * Transform a React component into a Stencil component for server side rendering
 *
 * Note: this code should only be loaded on the server side, as it uses heavy Node.js dependencies
 * that when loaded on the client side would increase the bundle size.
 *
 * @param options - the options for the component
 * @returns - the component for server side rendering
 */
export const createComponentForServerSideRendering = <
  I extends HTMLElement,
  E extends EventNames = Record<string, never>,
>(
  options: CreateComponentForServerSideRenderingOptions,
) => {
  return (async ({ children, ...props }: StencilProps<I> = {}) => {
    /**
     * Ensure we only run on the server
     */
    if (!('process' in globalThis) || typeof window !== 'undefined') {
      throw new Error('`createComponentForServerSideRendering` can only be run on the server')
    }

    /**
     * Get all props from the react component and parse
     */
    const stringProps = Object.entries(props).reduce((acc, [key, value]) => {
      const propValue = isPrimitive(value)
        ? `"${value}"`
        : Array.isArray(value) && value.every(isPrimitive)
          ? JSON.stringify(value)
          : undefined

      if (!propValue) {
        return acc
      }

      const propName = possibleStandardNames[key] || camelToDashCase(key)
      return (acc += ` ${propName}=${propValue}`)
    }, '')

    const toSerialize = `<${options.tagName}${stringProps} suppressHydrationWarning="true">`

    return new Promise((resolve) => {

      const writableStream = new Writable({
        async write(chunk, encoding, callback) {
          const serializedChildren = typeof chunk.toString === "function" ? chunk.toString() : chunk;
          resolve(await createStencilElement(serializedChildren))
          writableStream.end();
          callback();
        }
      });
      const { pipe } = ReactDOMServer.renderToPipeableStream(children, {
        onShellReady() {
          pipe(writableStream);
        },
        async onShellError(err) {
          const error = err instanceof Error ? err : new Error('Unknown error')
          console.log(
            `Failed to serialize light DOM for ${toSerialize.slice(0, -1)} />: ${
              error.message
            } - this may impact the hydration of the component`,
          )
          resolve(await createStencilElement(''))
          writableStream.end();
        },
      });

      const createStencilElement = async (serializedChildren: string) => {
        const toSerializeWithChildren = `${toSerialize}${serializedChildren}</${options.tagName}>`

          /**
           * Render the stencil component using the renderToString function from the generated hydration script
           */
          const { html } = await options.renderToString(toSerializeWithChildren, {
            fullDocument: false,
            serializeShadowRoot: true,
            prettyHtml: true,
          })

          if (!html) {
            throw new Error('No HTML returned from renderToString')
          }

          const serializedComponentByLine = html.split('\n')
          const hydrationComment = '<!--r.1-->'
          const isShadowComponent = serializedComponentByLine[1].includes('shadowrootmode="open"')
          const templateContent = isShadowComponent
            ? serializedComponentByLine.slice(2, serializedComponentByLine.indexOf(' </template>')).join('\n').trim()
            : undefined

          /**
           * `html-react-parser` is a Node.js dependency so we should make sure to only import it when run on the server
           */
          const { default: parse } = await import('html-react-parser')

          /**
           * parse the string into a React component
           */
          const StencilElement = () =>
            parse(html, {
              transform(reactNode, domNode) {
                if ('name' in domNode && domNode.name === options.tagName) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const props = (reactNode as any).props
                  /**
                   * remove the outer tag (e.g. `options.tagName`) so we only have the inner content
                   */
                  const CustomTag = `${options.tagName}`

                  /**
                   * if the component is not a shadow component we can render it with the light DOM only
                   */
                  if (!isShadowComponent) {
                    const { children, ...customProps } = props || {}
                        const __html = serializedComponentByLine
                        // remove the components outer tags as we want to set the inner content only
                        .slice(1, -1)
                        // bring the array back to a string
                        .join('\n')
                        .trim()
                        // remove any whitespace between tags that may cause hydration errors
                        .replace(/>\s+</g, '><')
                        // remove any leading or trailing whitespace inside the tags
                        .replace(/>\s*(.*?)\s*</g, '>$1<')

                    return <CustomTag {...customProps} suppressHydrationWarning={true} dangerouslySetInnerHTML={{ __html }} />
                  }

                  return (
                    <CustomTag {...props} suppressHydrationWarning>
                      {/* Create a shadow root for the component by using the template tag */}
                      <template
                        // @ts-expect-error - shadowrootmode is not a valid attribute
                        shadowrootmode="open"
                        suppressHydrationWarning={true}
                        dangerouslySetInnerHTML={{ __html: hydrationComment + templateContent }}
                      ></template>
                      {children}
                    </CustomTag>
                  )
                }
              },
            }) as React.ReactElement


          resolve(<StencilElement />)
      }
    });

  }) as unknown as ReactWebComponent<I, E>
}
