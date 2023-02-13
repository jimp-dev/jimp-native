
module.exports = (api) => {
    api.cache(true);

    return {
        presets: [
            "@babel/preset-typescript",
            [
                "@babel/preset-env",
                {
                    modules: process.env.BABEL_ENV === "module" ? false : "cjs",
                    useBuiltIns: false,
                },
            ],
        ],

        plugins: [
            process.env.BABEL_ENV !== "module" && "add-module-exports",
            [
                "transform-inline-environment-variables",
                { include: ["BABEL_ENV", "ENV"] },
            ],
        ].filter(Boolean)
    };
};