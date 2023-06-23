export function mutuallyExclusiveProps(props, propName, componentName, ...exclusiveProps) {
  const usedProps = exclusiveProps.filter((prop) => props[prop] !== undefined);
  if (usedProps.length > 1) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Mutually exclusive props: [${exclusiveProps.join(', ')}] cannot be used simultaneously.`,
    );
  }
  return null;
}

export function nonNegativeInteger(props, propName, componentName) {
  if (props[propName] < 0 || !Number.isInteger(props[propName])) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a non-negative integer.`,
    );
  }
  return null;
}

export function and(validations) {
  return (props, propName, componentName) => validations.some((validation) => {
    const error = validation(props, propName, componentName);
    return !!error;
  }) || null;
}

export function or(validations) {
  return (props, propName, componentName) => {
    const errors = validations
      .map((validation) => validation(props, propName, componentName))
      .filter((error) => error instanceof Error);
    if (errors.length === validations.length) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. None of the validations passed.`,
      );
    }
    return null;
  };
}

export function forbidExtraProps(propTypes) {
  return (props, propName, componentName) => {
    const knownProps = Object.keys(propTypes);
    const extraProps = Object.keys(props).filter((prop) => !knownProps.includes(prop));
    if (extraProps.length > 0) {
      return new Error(
        `Invalid prop(s) \`${extraProps.join(', ')}\` supplied to \`${componentName}\`. Validation failed.`,
      );
    }
    return null;
  };
}
