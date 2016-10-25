module.exports = {
  'env': {
    'browser': true,
    'node': true
  },
  'extends': 'airbnb',
  'globals': {
    '$': true
  },
  'installedESLint': true,
  'plugins': [
    'react',
    'jsx-a11y',
    'import',
  ],
  'rules': {
    'no-var': 'off',
    'prefer-arrow-callback': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'space-before-function-paren': ['error', 'always'],
  }
};
