import { createTopics } from './lib/admin';

createTopics().then(() => process.exit(0)).catch(console.error);
