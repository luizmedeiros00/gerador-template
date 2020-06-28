import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify-es';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const config = {
  input: 'src/entry.js',
  output: {
    name: 'GeradorTemplate',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    vue({
      css: true, // Dinamicamente injeta CSS como uma tag <style>
      compileTemplate: true, // Explicitamente converte template para função render
    }),
    buble(), // Transpila para ES5
  ],
};

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(uglify());
}

export default config;
