import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import cheerio from 'cheerio';
import { optimize } from 'svgo';
import { pascalCase } from 'change-case';
import dedent from 'dedent';
import { globby } from 'globby';
import svgstore from 'svgstore';

const componentsFolder = path.join('.', 'src/components/icons');

(async () => {
  const existingSprite = path.join('dist', 'icon-sprite.svg');

  // Remove existing sprite SVG.
  if (existsSync(existingSprite)) {
    await fs.rm(existingSprite);
  }

  const svgPaths = await globby('icons/*.svg', { absolute: true });
  const sprites = svgstore();

  await Promise.all(
    svgPaths.map(async (svgPath) => {
      const [svgName, variantName] = path.basename(svgPath, '.svg').split('-');
      const rawSvg = await fs.readFile(svgPath, 'utf8');

      /**
       * Run through SVGO.
       * @see https://github.com/svg/svgo#what-it-can-do
       */
      const optimizedSvg = (
        await optimize(rawSvg, {
          multipass: true,
          plugins: [
            'preset-default',
            {
              name: 'inlineStyles',
              params: {
                onlyMatchedOnce: false,
              },
            },
            'removeXMLNS',
            { name: 'removeViewBox', active: false },
            'convertStyleToAttrs',
            'sortAttrs',
            { name: 'removeAttrs', params: { attrs: 'fill' } },
          ],
        })
      ).data;

      // Validate color values.
      const $ = cheerio.load(optimizedSvg);
      $('svg *').each((i, element) => {
        const $el = $(element);

        ['stroke', 'fill'].forEach((attribute) => {
          const color = $el.attr(attribute);
          const validColors = ['currentColor', 'none', '#000'];

          if (color && !validColors.includes(color)) {
            throw new Error(
              `${svgName}: Invalid ${attribute} color: ${$.html(element)}`
            );
          }
        });
      });

      // Add icon to sprite sheet.
      sprites.add(svgName, optimizedSvg, 'utf8');

      /**
       * Bail out early if we're processing a variant (e.g. star-active.svg).
       * All subsequent steps should only happen once per icon component.
       */
      if (variantName) return;

      const iconName = `Icon${pascalCase(svgName)}`;
      const componentFolder = path.join(componentsFolder, iconName);
      await fs.mkdir(componentFolder, { recursive: true });

      const templateFileIfMissing = async (relativePath, contents) => {
        const filePath = path.join(componentFolder, relativePath);

        if (!existsSync(filePath)) {
          await fs.writeFile(filePath, `${contents}\n`, 'utf8');
        }
      };

      await templateFileIfMissing(
        `${iconName}.tsx`,
        dedent`
        import React from 'react';

        import { Icon } from '../../_private/Icon';
        import type { BaseIconProps } from '../../_private/Icon';

        export type ${iconName}Props = BaseIconProps;

        export function ${iconName}(props: ${iconName}Props) {
          return <Icon icon="${svgName}" {...props} />
        }
      `
      );
    })
  );

  // Remove some extra stuff from the sprite SVG.
  const spritesString = (
    await optimize(sprites.toString(), {
      plugins: ['removeDoctype', 'removeXMLProcInst'],
    })
  ).data;

  // Write new sprite SVG to disk.
  if (!existsSync('dist')) await fs.mkdir('dist');
  await fs.writeFile(existingSprite, spritesString);

  // Create export index.
  const iconComponents = (await fs.readdir(componentsFolder)).filter(
    (path) => !path.includes('.') && path.includes('Icon')
  );
  const iconExports = iconComponents
    .map((file) => path.basename(file, '.tsx'))
    .map(
      (component) =>
        `export { ${component} } from './${component}/${component}';`
    )
    .join('\n')
    .concat('\n');
  const indexPath = path.join(componentsFolder, 'index.ts');

  await fs.writeFile(indexPath, iconExports, 'utf8');
})();
