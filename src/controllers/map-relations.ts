export function mapRelations(include: any, mapping: any) {
  if (!include || !mapping) {
    return undefined;
  }

  if (typeof include !== "string") {
    const mapper = (model: string): any => {
      if (model.includes(".")) {
        const relations = model.split(".");

        const related = relations.shift();

        if (!related) {
          return null;
        }

        return {
          model: mapping[related],
          as: related,
          include: mapper(relations.join(".")),
        };
      }

      return { model: mapping[model], as: model };
    };

    include = include.map(mapper);
  }

  return include;
}
