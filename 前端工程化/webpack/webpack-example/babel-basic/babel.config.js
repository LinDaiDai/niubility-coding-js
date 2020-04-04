const presets = [
    [
        "@babel/env",
        {
            targets: {
                edge: "10",
                firefox: "60",
                chrome: "67",
                safari: "11.1",
            },
            useBuiltIns: "usage",
            corejs: 3
        },
    ]
];
const plugins = [
    [
        "@babel/plugin-transform-react-jsx"
    ]
]

module.exports = function(api) {
    console.log(api.env()) // envName
    return { presets, plugins }
};