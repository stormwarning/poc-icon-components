# icon-components

## Icon build setup

Any SVG files inside the root `icons` directory will be added to the icon sprite sheet. (This could be replaced with a Figma API response) The artwork should be as "flattened" as possible, on a 32px square artboard, and filled (or stroked) in black.

SVGs should be use camelCase if the name is made up of more than one word. Names with a hyphen — `visibility-hidden.svg` for example — *will* be added to the sprite, but will not have a separate component generated. The "base" `visibility` icon component should be manually edited to toggle between the two icons based on props.

Running the build script will generate a new icon sprite SVG, and a React component for any icons that don't already exist. The components can be edited in order to add custom options where necessary. The components wrap the base `Icon` component. Passing a `label` and `labelId` to the component will apply the appropriate accessibility attributes. There are four different `size` options: by default the icons are displayed at 32px, and can be scaled down to 24px, 20px, or 16px.

## General package setup

Package uses modern npm (avoiding additional tools where possible). The intention is that other design system components could be included in the `components` dir, but could also be converted to a monorepo if needed.

It uses [Vitest](https://vitest.dev) as a drop-in replacement for Jest for fast TypeScript transpilation during testing. Since it requires installing Vite as well, Vite is also leveraged for building Storybook examples.

Would need to add other convention tools like ESLint, Prettier, Husky, etc. as well as GitHub actions and Changesets for CI/CD.
