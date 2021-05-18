import simpleTemplate from './line-simple/template';

const template = [simpleTemplate];
const BaseTemplates = template.map((i) => ({ ...i, category: 'line' }));
export default BaseTemplates;
