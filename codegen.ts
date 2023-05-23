import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'http://localhost:8076/graphql',
    'https://cw-cds-qa-graphql-wa.azurewebsites.net',
    './client-schema.graphql',
  ],
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
  config: { namingConvention: { enumValues: 'keep' } },
};

export default config;
