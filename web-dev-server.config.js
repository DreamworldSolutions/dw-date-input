import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';
const commonjs = fromRollup(rollupCommonjs);

export default {
  host: '0.0.0.0',
  appIndex: 'demo/index.html',
  open: true,
  nodeResolve: true,
  plugins: [commonjs()]
};