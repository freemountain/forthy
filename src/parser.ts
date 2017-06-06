export const tokenize = (input: string) => input
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith("//"))
    .map(line => line.split(/\s/))
    .reduce((all, current) => all.concat(current), [])
    ;

export const map = (tokens: string[]): string[] => {
    const labels = tokens.reduce((all, token, index) => {
        if (token.startsWith("#")) all[token.slice(1)] = index;
        return all
    }, []);

    return tokens.map(token => {
        if (token.startsWith("#")) return "noop";
        if (!token.startsWith("&")) return token;

        const label = token.slice(1);

        if (!labels[label]) throw new Error("could not find label " + label);

        return labels[label];
    })
};

export const parse = (input: string) => map(tokenize(input));