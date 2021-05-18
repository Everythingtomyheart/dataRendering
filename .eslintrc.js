module.exports = {
  plugins: ['prettier'],
  extends: [require.resolve('@umijs/fabric/dist/eslint'), 'eslint:recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'accessor-pairs': 'error', // getset 成对出现
    'arrow-spacing': [
      // 要求箭头函数的箭头之前或之后有空格
      'error',
      {
        before: true,
        after: true
      }
    ],
    'block-spacing': ['error', 'always'], // 禁止或强制在代码块中开括号前和闭括号后有空格
    'brace-style': [
      // 大括号风格要求
      'error',
      '1tbs',
      {
        allowSingleLine: true // 允许块的开括号和闭括号在 同一行
      }
    ],
    camelcase: [
      // 强制使用骆驼拼写法命名约定
      'off',
      {
        properties: 'never'
      }
    ],
    'comma-dangle': ['error', 'never'], // 要求或禁止使用拖尾逗号
    'comma-spacing': [
      // 逗号前后空格
      'error',
      {
        before: false,
        after: true
      }
    ],
    'comma-style': ['error', 'last'], // 强制使用一致的逗号风格
    curly: ['error', 'multi-line'], // 强制所有控制语句使用一致的括号风格
    'eol-last': ['error', 'always'], // 禁止文件末尾保留一行空行
    eqeqeq: [
      // 要求使用 === 和 !==
      'error',
      'always'
    ],
    'jsx-quotes': ['error', 'prefer-single'], // jsx使用单引号
    'key-spacing': [
      // 强制在对象字面量的键和值之间使用一致的空格
      'error',
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    'new-cap': [
      // 要求构造函数首字母大写
      'error',
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    'new-parens': ['error', 'always'], // 要求调用无参构造函数时带括号
    'no-param-reassign': 'off',
    'no-array-constructor': 'error', // 禁止使用 Array 构造函数
    'no-cond-assign': ['error', 'always'], // 禁止条件表达式中出现赋值操作符
    'no-redeclare': 'off',
    'no-eval': 'error', // 禁止使用 eval
    'no-extend-native': 'error', // 禁止扩展原生对象
    'no-extra-bind': 'error', // 禁止不必要的函数绑定
    'no-extra-parens': 'off', // 禁止冗余的括号
    'no-floating-decimal': 'error', // 禁止浮点小数
    'no-implied-eval': 'error', // 禁止使用类似 eval() 的方法
    'no-label-var': 'error',
    'no-lone-blocks': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 3
      }
    ],
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-return-assign': ['error', 'always'],
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-whitespace-before-property': 'error',
    'one-var': [
      'error',
      {
        initialized: 'never'
      }
    ],
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ], // 强制操作符使用一致的换行符
    'padded-blocks': ['error', 'never'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'semi-spacing': [
      'error',
      {
        before: false,
        after: true
      }
    ],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': ['error', 'always'],
    'template-curly-spacing': ['error', 'never'],
    'wrap-iife': ['error', 'inside'],
    'yield-star-spacing': ['error', 'after'],
    'prefer-const': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-loop-func': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true
      }
    ]
  }
};
