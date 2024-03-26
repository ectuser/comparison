import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run comparison:serve:development',
        production: 'nx run comparison:serve:production',
      },
      ciWebServerCommand: 'nx run comparison:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
