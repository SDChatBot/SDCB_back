module.exports = {
    entry: './src/app.ts',
    output: {
        filename: './[name].js',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /.tsx?$/, loader: 'ts-loader' },
            { test: /\.ejs$/, use: 'ejs-loader' }
        ]
    }
}