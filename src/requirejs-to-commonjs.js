const requireJsToCommonJs = (file, { jscodeshift: j }) => {
  const toModuleExportsExpression = (right) => {
    const left = j.memberExpression(
      j.identifier('module'),
      j.identifier('exports')
    )
    const operator = '='
    return j.expressionStatement(j.assignmentExpression(operator, left, right))
  }

  const requireStatement = (value) =>
    j.callExpression(j.identifier('require'), [j.literal(value)])

  const exportizeFunctionBody = (body = []) =>
    body.map((node) => {
      return node.type === 'ReturnStatement'
        ? toModuleExportsExpression(node.argument)
        : node
    })

  const commonJsRequire = ({ variableName, modulePath }) =>
    j.variableDeclaration('var', [
      j.variableDeclarator(
        j.identifier(variableName),
        requireStatement(modulePath)
      ),
    ])

  const isFunctionExpression = (node) =>
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'

  return j(file.source)
    .find(j.CallExpression)
    .filter(({ node }) => node.callee.name === 'define')
    .at(0)
    .forEach((path) => {
      // TODO find a better way to detect global define() functions
      const isDefineAtGlobalScope = path.parent.parent.node.type === 'Program'
      if (!isDefineAtGlobalScope) {
        return
      }

      const defineArguments = path.node.arguments
      if (defineArguments.length === 1) {
        const arg = defineArguments[0]
        if (isFunctionExpression(arg)) {
          if (arg.body.type === 'ObjectExpression') {
            j(path).replaceWith(
              j.program([toModuleExportsExpression(arg.body)])
            )
          } else {
            j(path).replaceWith(j.program(exportizeFunctionBody(arg.body.body)))
          }
        } else if (arg.type === 'ObjectExpression') {
          j(path).replaceWith(j.program([toModuleExportsExpression(arg)]))
        }
      } else if (defineArguments.length === 2) {
        const [first, second] = defineArguments
        if (first.type !== 'ArrayExpression' && !isFunctionExpression(second)) {
          return
        }

        const requireNames = first.elements.map((element) => element.value)
        const variableNames = second.params.map((param) => param.name)

        const requireStatements = variableNames
          .map((name, i) => {
            if (name === 'require') {
              return
            }
            return commonJsRequire({
              variableName: name,
              modulePath: requireNames[i],
            })
          })
          .filter(Boolean)

        j(path).replaceWith(
          j.program([
            ...requireStatements,
            ...exportizeFunctionBody(second.body.body),
          ])
        )
      }
    })
    .toSource()
}

export default requireJsToCommonJs
